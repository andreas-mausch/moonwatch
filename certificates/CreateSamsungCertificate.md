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
