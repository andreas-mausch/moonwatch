import javax.net.ssl.HttpsURLConnection;
import javax.net.ssl.SSLContext;
import javax.net.ssl.TrustManager;
import javax.net.ssl.X509TrustManager;
import java.io.*;
import java.net.ConnectException;
import java.net.SocketTimeoutException;
import java.net.URL;
import java.security.cert.CertificateException;
import java.security.cert.X509Certificate;

public class Main {

    public static final String AUTHOR_CSR = "author.csr";

    public static void main(String[] args) throws Exception {
        /*
        Logging properties for raw HTTP logging

        handlers=java.util.logging.ConsoleHandler
        java.util.logging.ConsoleHandler.level=FINEST
        sun.net.www.protocol.http.HttpURLConnection.level=ALL
        sun.net.www.protocol.https.HttpsURLConnectionImpl.level=ALL
         */
        new Main().fetchCRT(
                "https://dev.tizen.samsung.com:443/apis/v2/authors",
                "userId",
                "accessToken",
                "author.csr",
                false,
                "author.crt"
        );
    }

    /*protected void generateCSR() throws Exception {
        IPath storePath = getStorePath();
        if (this.path == null) {
            generateCSR(this.infoList, "author", this.password, storePath.toOSString());
        } else {
            String extension = "";
            int i = this.path.lastIndexOf('.');
            if (i > 0)
                extension = this.path.substring(i + 1);
            if (extension.equals("jks") || extension.equals("keystore")) {
                this.alias = getAliases()[0];
                CSRGeneratorForAndroid.generateCSR(this.infoList,
                        this.path,
                        this.alias,
                        this.password,
                        this.password,
                        "author",
                        storePath.toOSString());
            } else if (extension.equals("p12")) {
                CSRGeneratorFromPKCS12.generateCSR(this.infoList, this.path, this.password, "author",
                        storePath.toOSString());
            } else {
                throw new Exception("Unknown file");
            }
        }
    }

    private boolean generateCSR(String[] arg, String user, String password, String filePath) throws Exception {
        boolean ret = true;
        try {
            log.debug("Start to generate CSR for Tizen keystore...OK");
            KeyPairGenerator keyGen = KeyPairGenerator.getInstance("RSA");
            keyGen.initialize(2048, new SecureRandom());
            log.debug("generate keygen object...OK");
            KeyPair keypair = keyGen.generateKeyPair();
            log.debug("generate keypair object...OK");
            publicKey = keypair.getPublic();
            filePath = (new File(filePath)).getAbsolutePath().replace("\\", "/");
            byte[] encodedprivatekey = keypair.getPrivate().getEncoded();
            String algo = "PBEWithSHA1AndDESede";
            int count = 20;
            Random random = new Random();
            byte[] salt = new byte[8];
            random.nextBytes(salt);
            PBEParameterSpec pbeParamSpec = new PBEParameterSpec(salt, count);
            PBEKeySpec pbeKeySpec = new PBEKeySpec(password.toCharArray());
            SecretKeyFactory keyFac = SecretKeyFactory.getInstance(algo);
            SecretKey pbeKey = keyFac.generateSecret(pbeKeySpec);
            log.debug("generate PBE parameter set...OK");
            Cipher pbeCipher = Cipher.getInstance(algo);
            pbeCipher.init(1, pbeKey, pbeParamSpec);
            byte[] ciphertext = pbeCipher.doFinal(encodedprivatekey);
            AlgorithmParameters algparms = AlgorithmParameters.getInstance(algo);
            algparms.init(pbeParamSpec);
            EncryptedPrivateKeyInfo encinfo = new EncryptedPrivateKeyInfo(algparms, ciphertext);
            byte[] encryptedPkcs8 = encinfo.getEncoded();
            log.debug("generate PKCS#8 encrypted key...OK");
            File directoryFile = new File(filePath);
            if (!directoryFile.exists())
                directoryFile.mkdirs();
            privateKey = keypair.getPrivate();
            String fl = String.valueOf(filePath) + "/" + user + ".pri";
            FileOutputStream out = new FileOutputStream(fl);
            out.write(encryptedPkcs8);
            out.close();
            log.debug("save pri file...OK");
            fl = String.valueOf(filePath) + "/" + user + ".pub";
            out = new FileOutputStream(fl);
            byte[] ky = publicKey.getEncoded();
            out.write(ky);
            out.close();
            log.debug("save pub file...OK");
            String sigAlg = "SHA1withRSA";
            String params = "CN=" + arg[0] + ", OU=" + arg[1] + ", O=" + arg[2] + ", L=" + arg[3] + ", S=" + arg[4] + ", C=" + arg[5];
            log.debug("X500Principal param : " + params);
            X500Principal principal = new X500Principal(params);
            PKCS10CertificationRequest kpGen = new PKCS10CertificationRequest(sigAlg, principal, publicKey, (ASN1Set)new DERSet(), privateKey, null);
            byte[] c = kpGen.getEncoded();
            String type = "CERTIFICATE REQUEST";
            PemObject pemObject = new PemObject(type, c);
            StringWriter str = new StringWriter();
            PemWriter pemWriter = new PemWriter(str);
            pemWriter.writeObject((PemObjectGenerator)pemObject);
            pemWriter.close();
            str.close();
            PrintWriter printwriter = new PrintWriter(new BufferedWriter(new FileWriter(String.valueOf(filePath) + "/" + user + ".csr", false)));
            printwriter.println(str.toString());
            printwriter.close();
            log.debug("End to generate CSR for Tizen keystore...OK");
        } catch (Exception e) {
            ret = false;
            log.debug(e.getMessage());
            throw new Exception(e);
        }
        return ret;
    }*/

    protected void fetchCRT(String url, String userId, String accessToken, String csrFilename, boolean bVDMode, String intermediateFilename) throws ConnectException, Exception {
        URL obj = null;
        HttpsURLConnection con = null;
        Writer res = null;
        FileInputStream fis = null;
        try {
            obj = new URL(url);
            con = (HttpsURLConnection) obj.openConnection();
            con.setDoInput(true);
            con.setDoOutput(true);
            con.setRequestMethod("POST");
            con.setRequestProperty("content-type", "multipart/form-data; boundary=\"*****\"");
            con.setConnectTimeout(40000);
            con.setReadTimeout(40000);
            SSLContext context = SSLContext.getInstance("TLS");
            TrustManager[] tm = {new X509TrustManager() {
                public void checkClientTrusted(X509Certificate[] arg0, String arg1) throws CertificateException {
                }

                public void checkServerTrusted(X509Certificate[] arg0, String arg1) throws CertificateException {
                }

                public X509Certificate[] getAcceptedIssuers() {
                    return new X509Certificate[0];
                }
            }};
            context.init(null, tm, null);
            con.setSSLSocketFactory(context.getSocketFactory());
            StringBuffer postDataBuilder = new StringBuffer();
            String data = "--*****\r\n";
            postDataBuilder.append(data);
            data = "Content-Type: text/plain; charset=utf-8\r\n";
            postDataBuilder.append(data);
            data = "Content-Disposition: form-data; name=access_token\r\n";
            postDataBuilder.append(data);
            data = "\r\n";
            postDataBuilder.append(data);
            data = accessToken + "\r\n";
            postDataBuilder.append(data);
            data = "--*****\r\n";
            postDataBuilder.append(data);
            data = "Content-Type: text/plain; charset=utf-8\r\n";
            postDataBuilder.append(data);
            data = "Content-Disposition: form-data; name=user_id\r\n";
            postDataBuilder.append(data);
            data = "\r\n";
            postDataBuilder.append(data);
            data = userId + "\r\n";
            postDataBuilder.append(data);
            if (bVDMode) {
                data = "--*****\r\n";
                postDataBuilder.append(data);
                data = "Content-Type: text/plain; charset=utf-8\r\n";
                postDataBuilder.append(data);
                data = "Content-Disposition: form-data; name=platform\r\n";
                postDataBuilder.append(data);
                data = "\r\n";
                postDataBuilder.append(data);
                data = "VD\r\n";
                postDataBuilder.append(data);
            }
            data = "--*****\r\n";
            postDataBuilder.append(data);
            DataOutputStream wr = null;
            String filename = AUTHOR_CSR;
            data = "Content-Disposition: form-data; name=csr; filename=" + filename + "; filename*=utf-8''" +
                    filename + "\r\n" + "\r\n";
            postDataBuilder.append(data);
            wr = new DataOutputStream(con.getOutputStream());
            wr.writeBytes(postDataBuilder.toString());
            System.out.println("postDataBuilder = " + postDataBuilder);
            fis = new FileInputStream(csrFilename);
            int maxBufferSize = 1024;
            int bufferSize = Math.min(fis.available(), maxBufferSize);
            byte[] arrayOfByte = new byte[bufferSize];
            int byteRead = fis.read(arrayOfByte, 0, bufferSize);
            while (byteRead > 0) {
                wr.write(arrayOfByte);
                bufferSize = Math.min(fis.available(), maxBufferSize);
                byteRead = fis.read(arrayOfByte, 0, bufferSize);
            }
            fis.close();
            postDataBuilder.setLength(0);
            data = "\r\n";
            postDataBuilder.append(data);
            data = "--*****--\r\n";
            postDataBuilder.append(data);
            wr.writeBytes(postDataBuilder.toString());
            System.out.println("postDataBuilder = " + postDataBuilder);
            wr.flush();
            wr.close();
            int responseCode = 0;
            responseCode = con.getResponseCode();
            if (responseCode == 403)
                throw new Exception(
                        "You've made too many requests in a given amount of time.\nPlease wait and try your request again later.");
            if (responseCode != 200) {
                System.out.println("con.getResponseMessage() = " + con.getResponseMessage());
                throw new Exception("Server response code : " + responseCode);
            }
            BufferedReader in = null;
            in = new BufferedReader(new InputStreamReader(con.getInputStream()));
            res = new OutputStreamWriter(new FileOutputStream(intermediateFilename), "UTF8");
            char[] buffer = new char[512];
            int readcount = 0;
            while ((readcount = in.read(buffer)) != -1)
                res.write(buffer, 0, readcount);
            in.close();
            res.close();
        } catch (SocketTimeoutException socketTimeoutException) {
            throw new Exception("Socket timeout!");
        } catch (IOException e0) {
            e0.printStackTrace();
        } finally {
            if (res != null) {
                res.close();
            }
            if (fis != null) {
                fis.close();
            }
        }
    }
}
