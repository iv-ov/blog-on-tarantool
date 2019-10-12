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


local json = require('json')

function addItemHandler(req)
    local data = req:json()
    local result = box.space.blog:auto_increment{
        data.title, data.text, os.time()
    }
    return {
        status = 201,
        headers = {
            -- @todo: carefully consider the right value for production. Now we allow any site to access the API
            ['Access-Control-Allow-Origin'] = '*'
        },
        body = json.encode(result)
    }
end


function getListHandler(req)
    local page = tonumber(req:query_param('page')) or 1

    local itemsPerPage = 2
    local offset = itemsPerPage * (page - 1)

    local items = box.space.blog:select({}, {offset = offset, limit = itemsPerPage})
    local totalCount = box.space.blog:len()
    return {
        status = 200,
        headers = {
            -- @todo: carefully consider the right value for production. Now we allow any site to access the API
            ['Access-Control-Allow-Origin'] = '*'
        },
        body = json.encode({
            items = items,
            totalPages = math.ceil(totalCount / itemsPerPage)
        })
    }
end

-- Обобщённый обработчик манипуляции над конкретным постом — удаления и редактирования
function itemManipulationHandler(req)
    local id = tonumber(req:stash('id'))

    local result = 'Hmm...';

    if req.method == 'DELETE' then
        result = delete(id)
        return {
            status = 200,
            headers = {
                -- @todo: carefully consider the right value for production. Now we allow any site to access the API
                ['Access-Control-Allow-Origin'] = '*'
            },
            body = json.encode(result)
        }
    end

    if req.method == 'PUT' then
        result = update(id, req:post_param())
    end

    if req.method == 'OPTIONS' then
        return {
            status = 200,
            headers = {
                -- @todo: carefully consider the right value for production. Now we allow any site to access the API
                ['Access-Control-Allow-Origin'] = '*',
                ['Access-Control-Allow-Methods'] = 'PUT, DELETE, GET, OPTIONS'
            }
        }
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
