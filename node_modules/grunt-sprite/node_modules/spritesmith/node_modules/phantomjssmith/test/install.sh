#!/usr/bin/env bash

# If we are installing PhantomJS@1.9.2
if [[ "$PHANTOMJS_VERSION" == "1.9.2" ]]; then
  # Uninstall current version
  sudo rm "$(which phantomjs)"

  # Download and install 1.9.2 from website
  wget "https://phantomjs.googlecode.com/files/phantomjs-1.9.2-linux-x86_64.tar.bz2"
  tar xvf phantomjs-1.9.2-linux-x86_64.tar.bz2
  sudo ln -s $PWD"/phantomjs-1.9.2-linux-x86_64/bin/phantomjs" /usr/bin/phantomjs
fi