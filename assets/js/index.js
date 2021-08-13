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

function Validator(options) {

    const fromElement = document.querySelector(options.form)
    if(fromElement) {
        //khi ấn submit form
        fromElement.onsubmit = function(e) {
            
            e.preventDefault();
            let isFormValid = true
            options.rules.forEach((rule) => {
                const inputElement = fromElement.querySelector(rule.selector)
                const errElement = inputElement.parentElement.querySelector(options.errSelector)
                const errMessage = rule.test(inputElement.value)
                if(errMessage) {
                    console.log(errMessage)

                    errElement.innerText = errMessage
                    inputElement.parentElement.classList.add('invalid')
    
                    const err = errMessage
                    console.log(!!err)
                    if(!!err){
                        isFormValid = false
                    }
                }
            })
            console.log(isFormValid)
            if(isFormValid) {
                if( typeof options.onSubmit === 'function') {
                    //lấy ra tất cả các thẻ input
                       
                        const allInput = fromElement.querySelectorAll('[name]')
                        const formValue = Array.from(allInput).reduce((value,input) => {
                            value[input.name] = input.value
                            return  value
                        },{
                            id: Math.floor(Math.random()*10000)
                            })

                        options.onSubmit(formValue)

                    
                }
            }

    }

        //lập qua mỗi rule 
        options.rules.forEach((rule) => {
            const inputElement = document.querySelector(rule.selector)
            const errElement = inputElement.parentElement.querySelector(options.errSelector)
            if(inputElement) {

                //khi người dùng blur khỏi input
                inputElement.onblur = function() {
                    const errMessage = rule.test(inputElement.value)
                    if(errMessage) {
                        errElement.innerText = errMessage
                        inputElement.parentElement.classList.add('invalid')
                    } else {
                        errElement.innerText = ''
                        inputElement.parentElement.classList.remove('invalid')
                    }
                }

                //khi người dùng nhập
                inputElement.oninput = function() {
                    errElement.innerText = ''
                    inputElement.parentElement.classList.remove('invalid')

                }
            }
        })}
}


Validator.isRequired = function (selector) {
    return {
        selector,
        /* nhận giá trị người dùng nhập khi rule.test */
        test(value) {
            return value.trim() ? undefined : 'Vui lòng nhập lại'
        }
    }
}

Validator.isEmail = function (selector) {
    return {
        selector,
        test(value) {
            const regex = /^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/
            return regex.test(value) ? undefined : 'Vui lòng nhập lại email'
        }
    }
}

Validator.numberPhone = function (selector) {
    return {
        selector,
        test(value) {
            const regex = /^(0?)(3[2-9]|5[6|8|9]|7[0|6-9]|8[0-6|8|9]|9[0-4|6-9])[0-9]{7}$/
            return regex.test(value) ? undefined : 'Vui lòng nhập lại số điện thoại'
        }
    }
}

Validator({
    form: '#form',
    errSelector:'.input__message',
    rules: [
        Validator.isRequired('#fullName'),
        Validator.isRequired('#age'),
        Validator.isEmail('#email'),
        Validator.numberPhone('#sdt'),
        Validator.isRequired('#anh')
       /*  Validator.isRequired('#city'),
        Validator.isRequired('#district') */
    ],
    onSubmit(data) {
        
        http.post("http://localhost:3000/student",data)
        render(data)
        document.querySelector('.form-input').style.display = "none"
        document.querySelector('.col-8').className = "col-12"
        document.querySelector('#fullName').value = ""
        document.querySelector('#age').value = ""
        document.querySelector('#email').value = ""
        document.querySelector('#sdt').value = ""
        document.querySelector('#anh').value = ""
        document.querySelector('#city').value = ""
        document.querySelector('#district').value = ""
    }
});


/* render dữ liệu lên input */

function renderCity(data) {
    let html = "<option value='0'>&nbsp;Chọn Tỉnh/Thành Phố...</option>"
    let option = data.map(item => `<option value="${item.idProvince}-${item.name}">${item.name}</option>`)
    document.querySelector('#city').innerHTML = html + option.join('')
}

function renderDistrict(data) {
    let html = "<option value='0'>&nbsp;Chọn Quận/Huyện...</option>"
    let option = data.map(item => `<option value="${item.idDistrict}-${item.name}">${item.name}</option>`)
    document.querySelector('#district').innerHTML = html + option.join('')
}

const cityAPI = 'https://sheltered-anchorage-60344.herokuapp.com/province'
const http = new API()
http.get(cityAPI).then(data =>{
    renderCity(data)
}) 

/* gọi dữ liệu quận huyện */

document.querySelector('#city').onchange = ()=> {
    const value = document.querySelector('#city').value.slice(0,2)
    console.log(value)
    const districtAPI = "https://sheltered-anchorage-60344.herokuapp.com/district?idProvince="+value
    http.get(districtAPI).then(data =>{
       renderDistrict(data)
    
    })
}

document.querySelectorAll('.student-form__close').forEach(item => {
    item.onclick= ()=>{
        document.querySelector('.form-input').style.display = "none"
        document.querySelector('.col-8').className = "col-12"
        document.querySelector('.edit').style.display="none"
    }
}) 

function handleClose() {
    document.querySelector('.form-input').style.display = "none"
        document.querySelector('.col-8').className = "col-12"
        document.querySelector('.edit').style.display="none"
}

document.querySelector('.create-student').onclick= ()=>{
    document.querySelector('.form-input').style.display = "block"
    document.querySelector('.col-12').className = "col-8"
    document.querySelector('.create').style.display="block"
}


function getData(){
    return new Promise( function(resolve) {
        http.get("http://localhost:3000/student").then(data => {
            resolve(data)
            console.log(data)
        })
    })
}


function render(item){
   
    const html = `
    <div class="col-8-4">
        <div class="student student-${item.id}">
            <div class="student__img" style="background-image: url(${item.img});"></div>
            <div class="student__profile">
                <h3 class="student__profile-name">${item.name}</h3>
                <p class="student__profile-age"><span class="student__profile-information">Tuổi</span> :${item.age}</p>
                <p class="student__profile-email"><span class="student__profile-information">Email</span>:${item.email}</p>
                <p class="student__profile-sdt"><span class="student__profile-information">Số điện thoại</span>:${item.sdt}</p>
                <p class="student__profile-address"><span class="student__profile-information">Địa chỉ</span>:${item.district.slice(4)}-${item.city.slice(3)}</p>
                <div class="student__profile-btn">
				<button class="student__profile-btn-see"> <a href="./student-information.html?id=${item.id}">Xem</a></button>
                <button class="student__profile-btn-edit" onclick ="handleOnEdit(${item.id})">Sửa</button>
			    </div>
            </div>
            <span class="student__close" onclick="handleOnDelete(${item.id})"> <i class="fas fa-times"></i></span>
        </div>
    </div>
    `

    document.querySelector('.list-student').insertAdjacentHTML("afterbegin",html)
}

function renderEdit(data){
    const html = `
					<h3 style="font-size: 2.2rem;
				text-align: center;
				padding: 20px 0;">Sửa sinh viên</h3>
				<span class="student-form__close student__close" onclick="handleClose()"> <i class="fas fa-times"></i></span>
					<div class="input__group ">
						<input type="text" class="input__input" placeholder=" " name="name" id ="fullNameEdit" value="${data.name}">
						<label for="name" class="input__label">Họ và tên</label>
						<span class="hidden-warring">
							<svg class="Input_icon__1WC0H" width="16" height="16" viewBox="0 0 16 16"><path d="M0 0h16v16H0V0z" fill="none"></path><path d="M15.2 13.1L8.6 1.6c-.2-.4-.9-.4-1.2 0L.8 13.1c-.1.2-.1.5 0 .7.1.2.3.3.6.3h13.3c.2 0 .5-.1.6-.3.1-.2.1-.5-.1-.7zM8.7 12H7.3v-1.3h1.3V12zm0-2.7H7.3v-4h1.3v4z" fill="currentColor"></path></svg>
						</span>
						<span class="input__message"></span>
					</div>
					<div class="input__group ">
						<input type="number" class="input__input" placeholder=" " name="age" id ="ageEdit" value="${data.age}">
						<label for="name" class="input__label">Tuổi</label>
						<span class="hidden-warring">
							<svg class="Input_icon__1WC0H" width="16" height="16" viewBox="0 0 16 16"><path d="M0 0h16v16H0V0z" fill="none"></path><path d="M15.2 13.1L8.6 1.6c-.2-.4-.9-.4-1.2 0L.8 13.1c-.1.2-.1.5 0 .7.1.2.3.3.6.3h13.3c.2 0 .5-.1.6-.3.1-.2.1-.5-.1-.7zM8.7 12H7.3v-1.3h1.3V12zm0-2.7H7.3v-4h1.3v4z" fill="currentColor"></path></svg>
						</span>
						
						<span class="input__message"></span>
					</div>
					<div class="input__group ">
						<input type="text" class="input__input" placeholder=" " name="email" id = "emailEdit" value="${data.email}">
						<label for="name" class="input__label">Email</label>
						<span class="hidden-warring">
							<svg class="Input_icon__1WC0H" width="16" height="16" viewBox="0 0 16 16"><path d="M0 0h16v16H0V0z" fill="none"></path><path d="M15.2 13.1L8.6 1.6c-.2-.4-.9-.4-1.2 0L.8 13.1c-.1.2-.1.5 0 .7.1.2.3.3.6.3h13.3c.2 0 .5-.1.6-.3.1-.2.1-.5-.1-.7zM8.7 12H7.3v-1.3h1.3V12zm0-2.7H7.3v-4h1.3v4z" fill="currentColor"></path></svg>
						</span>
						
						<span class="input__message"></span>
					</div>
					<div class="input__group ">
						<input type="text" class="input__input" placeholder=" " name="sdt" id = "sdtEdit" value="${data.sdt}">
						<label for="name" class="input__label">Số điện thoại</label>
						<span class="hidden-warring">
							<svg class="Input_icon__1WC0H" width="16" height="16" viewBox="0 0 16 16"><path d="M0 0h16v16H0V0z" fill="none"></path><path d="M15.2 13.1L8.6 1.6c-.2-.4-.9-.4-1.2 0L.8 13.1c-.1.2-.1.5 0 .7.1.2.3.3.6.3h13.3c.2 0 .5-.1.6-.3.1-.2.1-.5-.1-.7zM8.7 12H7.3v-1.3h1.3V12zm0-2.7H7.3v-4h1.3v4z" fill="currentColor"></path></svg>
						</span>
						<span class="input__message"></span>
					</div>
					<div class="input__group ">
						<input type="text" class="input__input" placeholder=" " name="img" id = "imgEdit" value="${data.img}">
						<label for="name" class="input__label">Ảnh</label>
						<span class="hidden-warring">
							<svg class="Input_icon__1WC0H" width="16" height="16" viewBox="0 0 16 16"><path d="M0 0h16v16H0V0z" fill="none"></path><path d="M15.2 13.1L8.6 1.6c-.2-.4-.9-.4-1.2 0L.8 13.1c-.1.2-.1.5 0 .7.1.2.3.3.6.3h13.3c.2 0 .5-.1.6-.3.1-.2.1-.5-.1-.7zM8.7 12H7.3v-1.3h1.3V12zm0-2.7H7.3v-4h1.3v4z" fill="currentColor"></path></svg>
						</span>
						<span class="input__message"></span>
					</div> 
					
					<div class="input__group ">
						<input type="text" class="input__input" placeholder=" " name="address" id = "address" value="${data.district.slice(4)}-${data.city.slice(3)}">
						<label for="name" class="input__label">Địa chỉ</label>
						<span class="hidden-warring">
							<svg class="Input_icon__1WC0H" width="16" height="16" viewBox="0 0 16 16"><path d="M0 0h16v16H0V0z" fill="none"></path><path d="M15.2 13.1L8.6 1.6c-.2-.4-.9-.4-1.2 0L.8 13.1c-.1.2-.1.5 0 .7.1.2.3.3.6.3h13.3c.2 0 .5-.1.6-.3.1-.2.1-.5-.1-.7zM8.7 12H7.3v-1.3h1.3V12zm0-2.7H7.3v-4h1.3v4z" fill="currentColor"></path></svg>
						</span>
						<span class="input__message"></span>
					</div> 
					<button class="input__submit" onclick = "handleOnClickEdit(${data.id})">Sửa</button>
    `

    document.querySelector('.edit').innerHTML = html
}

function handleOnDelete(id){
    http.delete("http://localhost:3000/student/"+id)
    document.querySelector('.student-'+id).parentElement.remove()
}


const renderData = async ()=>{
    const data = await getData()
    return data
}

function handleOnEdit(id){

    document.querySelector('.form-input').style.display="block"
    document.querySelector('.col-12').className= "col-8"
    document.querySelector('.edit').style.display="block"
    document.querySelector('.create').style.display="none"

    http.get("http://localhost:3000/student").then(data => {
        console.log(data)
        const newData = data.filter(item => item.id === Number(id))
        console.log(newData)
        renderEdit(...newData)
    })

}

renderData()
    .then(data =>{
        data.forEach(item=> {
            render(item)
        })
    })
    .then(
        setTimeout(()=>{
            document.querySelector('.loader_moda').style.display="none"
        },1000)
    )


function handleOnClickEdit(id){
    const address = document.querySelector('#address').value.split("-")
    console.log(address)
    const newData = {
        name: document.querySelector('#fullNameEdit').value,
        age:  document.querySelector('#ageEdit').value,
        email:  document.querySelector('#emailEdit').value,
        sdt:  document.querySelector('#sdtEdit').value,
        img: document.querySelector('#imgEdit').value ,
        district: "000-"+address[0],
        city: "000"+address[1]
    }

    http.put("http://localhost:3000/student/"+id,newData)
    document.querySelector('.form-input').style.display = "none"
    document.querySelector('.col-8').className = "col-12"
    document.querySelector('.edit').style.display="none"
    document.querySelector('.student-'+id).innerHTML = `
            <div class="student__img" style="background-image: url(${newData.img});"></div>
            <div class="student__profile">
                <h3 class="student__profile-name">${newData.name}</h3>
                <p class="student__profile-age"><span class="student__profile-information">Tuổi</span> :${newData.age}</p>
                <p class="student__profile-email"><span class="student__profile-information">Email</span>:${newData.email}</p>
                <p class="student__profile-sdt"><span class="student__profile-information">Số điện thoại</span>:${newData.sdt}</p>
                <p class="student__profile-address"><span class="student__profile-information">Địa chỉ</span>:${newData.district.slice(4)}-${newData.city.slice(3)}</p>
                <button class="student__profile-btn-edit" onclick ="handleOnEdit(${newData.id})">Sửa</button>
            </div>
            <span class="student__close" onclick="handleOnDelete(${newData.id})"> <i class="fas fa-times"></i></span>
    `
}