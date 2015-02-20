Vagrant.configure(2) do |config|
  config.vm.box = "hashicorp/precise32"
  config.vm.provision "shell", inline: <<-"SHELL"
    # nodejs and npm
    sudo apt-get update
    sudo apt-get install -y build-essential curl git fontconfig
    echo 'export PATH=$HOME/local/bin:$HOME/npm/bin:$PATH' >> $HOME/.bashrc
    . $HOME/.bashrc
    mkdir $HOME/local
    mkdir $HOME/node-latest-install
    cd $HOME/node-latest-install
    curl http://nodejs.org/dist/v0.12.0/node-v0.12.0.tar.gz | tar xz --strip-components=1
    ./configure --prefix=$HOME/local
    make install
    curl -L https://npmjs.org/install.sh | sh
    node -v
    npm -v

    # install grunt-cli bower, and jison without sudo
    npm config set prefix $HOME/npm
    rm -rf $HOME/npm
    mkdir -p $HOME/npm/bin
    npm cache clean
    npm install -g grunt-cli bower jison lodash-cli closurecompiler
    grunt --version
    bower --version
    jison --version
    lodash --version
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
    ccjs build/tablequery.js > build/tablequery.min.js
    grunt test

    rm -rf /vagrant/build/
    mkdir -p /vagrant/build/
    cp build/tablequery*.js /vagrant/build/
  SHELL
end
