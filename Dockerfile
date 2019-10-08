FROM tarantool/tarantool:1
COPY app.lua /opt/tarantool
COPY web /usr/share/tarantool
CMD ["tarantool", "/opt/tarantool/app.lua"]
