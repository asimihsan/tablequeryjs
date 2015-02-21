Vagrant.configure(2) do |config|
  config.vm.box = "hashicorp/precise32"
  config.vm.provision "shell", inline: <<-"SHELL"
    # nodejs and npm
    sudo apt-get update
    sudo apt-get install -y build-essential curl git fontconfig
    curl -sL https://deb.nodesource.com/setup | sudo bash -
    sudo apt-get install -y nodejs
    sudo bash -c 'curl -L https://npmjs.org/install.sh | sh'
    node -v
    npm -v

    # install grunt-cli bower, and jison without sudo
    echo 'export PATH=$HOME/local/bin:$HOME/npm/bin:$PATH' >> $HOME/.bashrc
    . $HOME/.bashrc
    export PATH=$HOME/local/bin:$HOME/npm/bin:$PATH
    npm config set prefix $HOME/npm
    rm -rf $HOME/npm
    mkdir -p $HOME/npm/bin
    npm cache clean
    npm install -g grunt-cli
    grunt --version
    npm install -g bower
    bower --version
    npm install -g jison
    jison --version
    npm install -g lodash-cli
    lodash --version
    npm install -g closurecompiler
    ccjs --version

    # copy then build tablequeryjs.
    cd $HOME
    rm -rf $HOME/tablequeryjs/
    mkdir -p $HOME/tablequeryjs/
    cp -r /vagrant/* $HOME/tablequeryjs/
    cd $HOME/tablequeryjs
    rm -rf node_modules bower_components build
    npm install
    bower install
    lodash compat --development \
      include=once,keys,each,uniqueId,extend,intersection,filter,values,isUndefined,map,contains,memoize,debounce,functions,any \
      iife="var tablequery = tablequery || {}; tablequery._ = (function() { %output%; return lodash; })();" \
      exports=global \
      --output build/lodash.custom.js && \
      sed -i 's/.*root._ = lodash;/\/\/root._ = lodash;/g' build/lodash.custom.js
    grunt build
    rm -rf /vagrant/build/
    mkdir -p /vagrant/build/
    cp build/tablequery*.js /vagrant/build/
    grunt test
  SHELL
end
