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

function addItemHandler(req)
    local data = req:json()
    local result = box.space.blog:auto_increment{
        data.title, data.text, os.time()
    }
    return req:render({json = result})
end

function getListHandler(req) return req:render({json = box.space.blog:select()}) end

-- Обобщённый обработчик манипуляции над конкретным постом — удаления и редактирования
function itemManipulationHandler(req)
    local id = tonumber(req:stash('id'))

    local result = 'Hmm...';
    if req.method == 'DELETE' then
        result = delete(id)
    end

    if req.method == 'PUT' then
        result = update(id, req:post_param())
    end

    return req:render({json = result})
end

function delete(id)
    return box.space.blog:delete(id)
end

function update(id, post_param)
    -- @todo implement update
    return box.space.blog:select(id)
end

local server = require('http.server').new(nil, 8080, {app_dir = '/usr/share/tarantool'})
server:route({path = '/', file = 'index.html'})
server:route({path = '/posts'}, getListHandler)
server:route({path = '/posts/create'}, addItemHandler)
server:route({path = '/posts/:id'}, itemManipulationHandler)
server:start()
