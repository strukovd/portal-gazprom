#!/bin/bash

# KIPSH_HOST="root@192.168.50.85"
# EXTERNAL_PORT=3335
# INTERNAL_PORT=3000
# SERVICE_NAME=portal-front
# PREV_VERSION=$(cat package.json | awk '/"version[ :"]*[0-9]*\.[0-9]*\.[0-9]*",/ {print $0}' | sed -s 's:[^0-9\.]*::g')
# if [ -z "$1" ]
# then
#   set -- "1"
# fi


# NPM_PATH="/home/user/.nvm/versions/node/v22.17.1/bin/npm"
# PM2_PATH="/home/user/.nvm/versions/node/v22.17.1/bin/pm2"

# # Проверяем, успешно ли мы получили пути
# if [ -z "$NPM_PATH" ]; then
#   echo "npm не найден. Убедитесь, что он установлен."
#   exit 1
# fi

# if [ -z "$PM2_PATH" ]; then
#   echo "pm2 не найден. Убедитесь, что он установлен."
#   exit 1
# fi


# # Up-аем версию
# FIRST_PART_OF_VERSION=$(echo $PREV_VERSION | grep -P '^[0-9]+\.[0-9]+\.' -o)
# PREV_BUILD_NUM=$(echo $PREV_VERSION | grep -P '[0-9]+$' -o)
# CUR_BUILD_NUM=$(($PREV_BUILD_NUM + $1 ))
# CUR_VERSION="$FIRST_PART_OF_VERSION$CUR_BUILD_NUM"

# # Обновляем версию в файле
# sed -i "s@\"version\"[: \t]*\"[0-9\.]*\"@\"version\": \"$CUR_VERSION\"@" package.json
# echo "Build version upgraded: $PREV_VERSION -> $CUR_VERSION"

# # Билдим
# echo "Build version: ${SERVICE_NAME}:${CUR_VERSION}"
# npm run build || exit 1

# # Копируем файлы на сервер
# echo "Copying files to the server..."
# # --exclude=node_modules
# rsync -avz --exclude=node_modules --exclude=.git . ${KIPSH_HOST}:/opt/protal-nuxt

# # Перезапуск приложения через PM2
# echo "Restarting the service with PM2 on the server..."
# RERUN_COMMAND="cd /opt/kipish-nuxt && \
#   $NPM_PATH install && \
#   $PM2_PATH stop ${SERVICE_NAME} || echo 'No process found to stop' && \
#   $PM2_PATH start $NPM_PATH --name '${SERVICE_NAME}' --cwd '/opt/kipish-nuxt' -- run start -- --key=kipish-nuxt && \
#   $PM2_PATH save
# "
# ssh -t -i ~/.ssh/id_rsa ${KIPSH_HOST} "$RERUN_COMMAND"

# # Логи
# echo "Checking PM2 logs:"
# LOGS_COMMAND="$PM2_PATH logs ${SERVICE_NAME} --lines 20"
# ssh -t -i ~/.ssh/id_rsa ${KIPSH_HOST} "$LOGS_COMMAND"



# TODO: в случае проблем с версией ноды:
# Убедится что ссылка указывает на нужную версию ноды: ls -l /usr/bin/node
# Иначе
# sudo rm /usr/bin/node
# nvm which current
# sudo ln -s /root/.nvm/versions/node/v22.12.0/bin/node /usr/bin/node