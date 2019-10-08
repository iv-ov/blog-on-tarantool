box.cfg{}

if not box.space.blog then
    s = box.schema.space.create('blog')
    s:format({
        {name = 'id', type = 'unsigned'},
        {name = 'title', type = 'string'},
        {name = 'text', type = 'string'},
        {name = 'time', type = 'unsigned'}
    })
    s:create_index('primary', {parts = {'id'}})
end
-----

function create(req)
    local data = req:post_param()
    local result = box.space.blog:auto_increment{
        data.title, data.text, os.time()
    }
    return req:render({json = result})
end

function list(req) return req:render({json = box.space.blog:select()}) end

local server = require('http.server').new(nil, 8080, {app_dir = '/usr/share/tarantool'})
server:route({path = '/', file = 'index.html'})
server:route({path = '/posts'}, list)
server:route({path = '/posts/create'}, create)
server:start()
