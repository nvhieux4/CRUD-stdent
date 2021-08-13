const url_string = window.location.href
const url = new URL(url_string);
const id = url.searchParams.get("id");

class API {
    send(method, url, body) {
        return fetch(url,{
            method,
            headers:{
                'Content-Type':'application/json'
            },
            body: body ? JSON.stringify(body) : undefined
        }).then(response => response.json())
        .catch(err => {
            console.log(err)
        })
    }
    get(url) {
        return this.send('GET', url )
    }
    post(url, body) {
        return this.send('POST', url, body)
    }
    put(url, body) {
        return this.send('PUT', url, body)
    }
    delete(url) {
        return this.send('DELETE',url)
    }
}

const http = new API()


const student = "http://localhost:3000/student/"+Number(id)

function renderStudent(data){
    const html = `
    <h3 >${data.name}</h3>
    `
    
    document.querySelector('.profile').innerHTML = html
}

function getData(){
    return new Promise( function(resolve) {
        http.get(student).then(data => {
            resolve(data)
            
        })
    })
}

const renderData = async ()=>{
    const data = await getData()
    return data
}

renderData()
    .then(data =>{
        console.log(data)
        renderStudent(data)
    })