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

### Vagrant

If you prefer to not litter your system you can use Vagrant to keep Tizen Studio in a virtual box
(it also contains npm and node, however outdated versions from the Ubuntu repo).

```bash
vagrant up

# SDB
vagrant ssh -c 'sdb devices'
vagrant ssh -c 'sdb connect 192.168.xx.xx' # Your watch' IP address

# Certificate
# See also here: https://stackoverflow.com/questions/61540051/cli-tizen-build-web-displays-invalid-password-error
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

vagrant ssh -c 'cd /vagrant/ && tizen package --type wgt --sign MyProfile -- ./build/'
# On errors check this log: /home/vagrant/tizen-studio-data/cli/logs/cli.log
vagrant ssh -c 'cd /vagrant/ && tizen install -n ./build/moonwatch.wgt'
vagrant halt
```
