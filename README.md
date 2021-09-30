# MoonWatch

This is a simple watch face for a Tizen Wearable (Samsung Galaxy watch) based on their BasicWatch sample.

This project uses npm, webpack, typescript, scss and eslint (heavily inspired by https://github.com/LukeDS-it/tizen-web-base).

See also here: https://github.com/Morkalork/tizen-basics. This guy finds the right words of the Tizen development experience in general.

I have also written a little rant myself: https://andreas-mausch.de/blog/2020/06/22/tizen/

## Requirements

- Tizen SDK (`sdb` and `tizen`)

## Develop

### Clean

```bash
npm run clean
```

### Develop (build and watch files)

```bash
npm run dev
```

### Build

```bash
npm run build
```

### Lint

```bash
npm run lint
```

### Test

```bash
npm run test
```

### Package to .wgt

```bash
npm run tizen:package
```

### Install on the watch (make sure sdb is connected)

```bash
npm run tizen:install
```

### Run on the watch (make sure sdb is connected)

```bash
npm run tizen:run
```

### sdb commands

```bash
sdb devices
sdb connect 192.168.1.104:26101
sdb get-state
```

### Signing Certificate

For installing your app on a real device, you need to register a certificate in your Samsung Developer Account.
Unfortunately, there seems to be no way to do it via CLI.

Therefore you need to register a certificate using the Tizen Studio manually.
This is a one-time task though (well, it is valid for a year),
and you can re-use the generated certificates with the `sdb` and `tizen` commands.  
Note: There are *Tizen certificates* and *Samsung certificates*.
For a real device, you need a *Samsung certificate*.

#### Tizen certificate

The *Tizen certificate* only works with the emulator, but **not on a real device**.

See also [here](https://stackoverflow.com/questions/61540051/cli-tizen-build-web-displays-invalid-password-error).

```bash
tizen certificate --alias MyTizen --country DE --state Hamburg --city Hamburg --organization Tizen --unit Development --name neonew --email neonew@gmail.com --filename mycert --password password
# 'mycert' has been generated in '/home/vagrant/tizen-studio-data/keystore/author'.
tizen security-profiles add --name MyProfile --author /home/vagrant/tizen-studio-data/keystore/author/mycert.p12 --password password
openssl pkcs12 -nokeys -info -in /home/vagrant/tizen-studio-data/keystore/author/mycert.p12 -passin pass:password
openssl pkcs12 -nokeys -info -in /home/vagrant/tizen-studio/tools/certificate-generator/certificates/distributor/tizen-distributor-signer.p12 -passin pass:tizenpkcs12passfordsigner
tizen security-profiles set-active --name MyProfile
tizen security-profiles list

# Now, edit the /home/vagrant/tizen-studio-data/profile/profiles.xml and replace the passwords with 'password' and 'tizenpkcs12passfordsigner'

# With gnome-keyring set up, this should work:
# /home/vagrant/tizen-studio/tools/certificate-encryptor/secret-tool lookup --label=tizen-studio
```

#### Samsung certificate

There are two subtypes of certificates: author and distributor.
You need both.

The author certificate is a certificate for an individual (or a company).

The distributor certificate is needed for submitting your app to the Samsung store,
or to deploy your app on your own device.
In this case, a list of device IDs is needed.

[Here](https://developer.samsung.com/galaxy-watch-tizen/getting-certificates/create.html) are the instructions
for generating a certificate from the Samsung website.

You can use this command (run on the watch via `sdb shell`) to obtain the Watch' DUID:

```bash
/opt/etc/duid-gadget anystring
```

Note: There are two versions of DUIDs.
They can start with either *1.0#* or *2.0#*.
If you run `duid-gagdet` with any parameter, the output format is in version 2.

After you got your certificate (you need the files *author.p12* and a *distributor.p12*),
you can set up your security profile the same way as described in the *Tizen certificate* section.

```bash
tizen security-profiles add --name MyProfile --author /vagrant/certificates/author.p12 --dist /vagrant/certificates/distributor.p12 --password '<PASSWORD>' --dist-password '<PASSWORD>'
```

My */home/vagrant/tizen-studio-data/profile/profiles.xml* looked like this (it will prompt for the password):

```xml
<?xml version="1.0" encoding="UTF-8" standalone="no"?>
<profiles active="MyProfile" version="3.1">
<profile name="MyProfile">
<profileitem ca="" distributor="0" key="/vagrant/certificates/author.p12" password="/vagrant/certificates/author.pwd" rootca=""/>
<profileitem ca="" distributor="1" key="/vagrant/certificates/distributor.p12" password="/vagrant/certificates/distributor.pwd" rootca=""/>
<profileitem ca="" distributor="2" key="" password="" rootca=""/>
</profile>
</profiles>
```

In case you are not prompted for the password during the `tizen package` step, you might need to fill in your password in this file directly.

(File paths will be different if you don't use Vagrant.)

### Vagrant

If you prefer to not litter your system you can use Vagrant to keep Tizen Studio in a virtual box
(it also contains npm and node, however outdated versions from the Ubuntu repo).

```bash
vagrant up

# SDB
vagrant ssh -c 'sdb devices'
vagrant ssh -c 'sdb connect 192.168.xx.xx' # Your watch' IP address

vagrant ssh -c 'cd /vagrant/ && tizen package --type wgt --sign MyProfile -- ./build/'
vagrant ssh -c 'cd /vagrant/ && tizen install --name ./build/moonwatch.wgt'
vagrant halt
```

On errors check this log file: */home/vagrant/tizen-studio-data/cli/logs/cli.log*.
