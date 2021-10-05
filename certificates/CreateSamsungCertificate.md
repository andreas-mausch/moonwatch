I did some reverse engineering on Tizen Studio to find out
how the author and distributor certificates are generated.

# Reasoning

I want to avoid installing Ubuntu with the full Tizen Studio every time,
because their requirements are just too restricting (Ubuntu only, Java 8 only etc.).  
Their CLI package contains no way to generate the certificate. Wow.

# Download the Certificate Extension

So first, I found you need to install the [Samsung Certificate Extension](https://developer.samsung.com/galaxy-watch-tizen/getting-certificates/install.html).

Tizen Studio is based on Eclipse and all of Samsung's plugins are written in Java.

One screenshot shows the URL of the extension, packaged as a zip file:

![Certificate Extension URL](https://d3unf4s5rp9dfh.cloudfront.net/GlxyWatchDevelop_doc/packageManager_extensionSDKenabled.png)

Some googling, and I found this link:

https://d3unf4s5rp9dfh.cloudfront.net/sdk-manager/repository/tizen-certificate-extension_2.0.42.zip

# Extract the jar

Inside this zip, there are different files for different target platforms.
I went with *binary/cert-add-on_2.0.42_ubuntu-64.zip*.

![tizen-certificate-extension_2.0.42.zip](tizen-certificate-extension_2.0.42.zip.png)

Now there you can find *data/ide/plugins/org.tizen.common.cert_1.0.0.201911210714.jar*.

![cert-add-on_2.0.42_ubuntu-64.zip](cert-add-on_2.0.42_ubuntu-64.zip.png)

# Finding the API calls

Opened in [JD-GUI](http://java-decompiler.github.io/), I found a class named
*org.tizen.common.cert.util.AuthorGenerator*.

![jd-gui-AuthorGenerator](jd-gui-AuthorGenerator.png)

It contains an URL: *https://dev.tizen.samsung.com:443/apis/v2/authors*.
Also, in `CertificateGenerator.fetchCRT()` you can see how the request is built.

![jd-gui-CertificateGenerator](jd-gui-CertificateGenerator.png)

There is some more interesting stuff, like `SigninDialog.validateToken()`.

![jd-gui-SigninDialog](jd-gui-SigninDialog.png)

It contains some base64 credentials:

```
      con.setRequestProperty("x-osp-appId", "4fb7fnf3np");
      con.setRequestProperty("authorization", "Basic NGZiN2ZuZjNucDo1NEM0RkNEQTIwOTgyRUNGQUFBNzZCODVFRjU4QUUxMQ==");
```

Just to share it, this is `4fb7fnf3np:54C4FCDA20982ECFAAA76B85EF58AE11` in plain text.

# Extract the CA certificate

Inside the jar, there is a folder res/ca, which contains the certificates for the Samsung CA.

# Generate an author CSR

Format: PKCS#10  
Keypair algorithm: RSA 2048 bit

The private key is stored as `.pri` file and is encrypted via `PBEWithSHA1AndDESede` (which is equivalent to `PBE-SHA1-3DES`).

```
CN=<username>
OU=<department>
O=<organization>
L=<city>
S=<state>
C=<country>
```

## Generate keypair via openssl

```bash
openssl genrsa -out author.key.pem 2048
openssl rsa -in author.key.pem -outform PEM -pubout -out author.key.pem.pub
```

## Generate CSR via openssl

```bash
openssl req -new -key author.key.pem -out author.csr -subj "/C=DE/L=Hamburg/O=gear-certificate/CN=gear-certificate@protonmail.com"
```

# Obtain Access Token

Go to this URL in the browser, and login with your Samsung credentials:

```
https://account.samsung.com/accounts/TDC/signInGate?clientId=4fb7fnf3np&tokenType=TOKEN
```

(taken from `SigninDialog.loginUrl`)

Your response will look like this:

```json
{
   "access_token":"gIzkyquITu",
   "token_type":"bearer",
   "access_token_expires_in":"863909",
   "refresh_token":"-1",
   "refresh_token_expires_in":"-1",
   "userId":"xxg0twjx1a",
   "client_id":"4fb7fnf3np",
   "inputEmailID":"gear-certificate@protonmail.com",
   "api_server_url":"eu-auth2.samsungosp.com",
   "auth_server_url":"eu-auth2.samsungosp.com",
   "close":true,
   "closedAction":"signInSuccess"
}
```

I don't really understand what the website does. It does a CSRF POST to https://account.samsung.com/accounts/TDC/signInProc?v=1633174758941,
but the password is client-side hashed or encrypted already.

The important bit is: After you logged in, you are presented a JSON response with your `userId` and your `access_token`.
You need both for the next step.

# Request the Certificate

```bash
curl -v -X POST https://dev.tizen.samsung.com:443/apis/v2/authors -F access_token=<ACCESS_TOKEN> -F user_id=<USER_ID> -F csr=@author.csr --output author.crt
```

(See also *GenerateCertificate.java*.)

![generated-certificate](generated-certificate.png)

# Convert the Certificate, the CA and your key to a .p12 archive

```bash
cat author.crt ca/gear_test_author_CA.cer > author-and-ca.crt
openssl pkcs12 -export -out author.p12 -inkey author.key.pem -in author-and-ca.crt -name UserCertificate
```

# Generate a distributor CSR

TODO

DUID etc.
