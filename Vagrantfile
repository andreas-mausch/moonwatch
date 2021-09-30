# -*- mode: ruby -*-
# vi: set ft=ruby :

$script = <<-SCRIPT
echo "Downloading Tizen Studio (please stand by).."
wget --no-verbose http://download.tizen.org/sdk/Installer/tizen-studio_4.1/web-cli_Tizen_Studio_4.1_ubuntu-64.bin
chmod +x web-cli_Tizen_Studio_4.1_ubuntu-64.bin
echo "Installing Tizen Studio.."
./web-cli_Tizen_Studio_4.1_ubuntu-64.bin --accept-license /home/vagrant/tizen-studio
# ./tizen-studio/package-manager/package-manager-cli.bin --accept-license show-pkgs
echo "Update path.."
export PATH="$PATH:/home/vagrant/tizen-studio/tools/ide/bin:/home/vagrant/tizen-studio/tools"
echo 'export PATH="$PATH:/home/vagrant/tizen-studio/tools/ide/bin:/home/vagrant/tizen-studio/tools"' >> /home/vagrant/.profile
echo "Checking sdb and tizen are available.."
sdb version
tizen version
SCRIPT

Vagrant.configure("2") do |config|
  config.vm.box = "ubuntu/focal64"
  config.vm.box_version = "20210506.0.0"
  config.vm.provision "shell", inline: "apt-get -qq update && apt-get install -qq zip nodejs npm gnome-keyring openjdk-8-jre-headless"
  config.vm.provision "shell", inline: $script, privileged: false
end
