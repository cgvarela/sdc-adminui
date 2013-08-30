#!/bin/bash
#
# Copyright (c) 2013 Joyent Inc., All rights reserved.
#

export PS4='[\D{%FT%TZ}] ${BASH_SOURCE}:${LINENO}: ${FUNCNAME[0]:+${FUNCNAME[0]}(): }'
set -o xtrace

PATH=/opt/local/bin:/opt/local/sbin:/usr/bin:/usr/sbin
PATH=/opt/smartdc/adminui/build/node/bin:$PATH

host=`hostname`

echo "Updating adminui service manifest"
$(/opt/local/bin/gsed -i"" \
  -e "s/@@PREFIX@@/\/opt\/smartdc\/adminui/g" \
  /opt/smartdc/adminui/smf/manifests/adminui.xml)

echo "Importing adminui service manifest"
svccfg import /opt/smartdc/adminui/smf/manifests/adminui.xml

exit 0
