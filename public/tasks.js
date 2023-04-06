async function buildTasksTable(tasksTable, tasksTableHeader, token, message) {
	try {
		const response = await fetch('/api/v1/tasks', {
			method: 'GET',
			headers: {
				'Content-Type': 'application/json',
				Authorization: `Bearer ${token}`,
			},
		})
		const data = await response.json()
		var children = [tasksTableHeader]
		if (response.status === 200) {
			if (data.count === 0) {
				tasksTable.replaceChildren(...children) // clear this for safety
				return 0
			} else {
				for (let i = 0; i < data.tasks.length; i++) {
					let editButton = `<td><button type="button" class="editButton" data-id=${data.tasks[i]._id}>edit</button></td>`
					let deleteButton = `<td><button type="button" class="deleteButton" data-id=${data.tasks[i]._id}>delete</button></td>`
					let rowHTML = `<td>${data.tasks[i].title}</td><td>${data.tasks[i].description}</td><td>${data.tasks[i].status}</td>${editButton}${deleteButton}`
					let rowEntry = document.createElement('tr')
					rowEntry.innerHTML = rowHTML
					children.push(rowEntry)
				}
				tasksTable.replaceChildren(...children)
			}
			return data.count
		} else {
			message.textContent = data.msg
			return 0
		}
	} catch (err) {
		message.textContent = 'A communication error occurred.'
		return 0
	}
}

document.addEventListener('DOMContentLoaded', () => {
	const logoff = document.getElementById('logoff')
	const message = document.getElementById('message')
	const logonRegister = document.getElementById('logon-register')
	const logon = document.getElementById('logon')
	const register = document.getElementById('register')
	const logonDiv = document.getElementById('logon-div')
	const email = document.getElementById('email')
	const password = document.getElementById('password')
	const logonButton = document.getElementById('logon-button')
	const logonCancel = document.getElementById('logon-cancel')
	const registerDiv = document.getElementById('register-div')
	const name = document.getElementById('name')
	const email1 = document.getElementById('email1')
	const password1 = document.getElementById('password1')
	const password2 = document.getElementById('password2')
	const registerButton = document.getElementById('register-button')
	const registerCancel = document.getElementById('register-cancel')
	const tasks = document.getElementById('tasks')
	const tasksTable = document.getElementById('tasks-table')
	const tasksTableHeader = document.getElementById('tasks-table-header')
	const addTask = document.getElementById('add-task')
	const editTask = document.getElementById('edit-task')
	const title = document.getElementById('title')
	const description = document.getElementById('description')
	const status = document.getElementById('status')
	const addingTask = document.getElementById('adding-task')
	const tasksMessage = document.getElementById('tasks-message')
	const editCancel = document.getElementById('edit-cancel')

	// section 2

	let showing = logonRegister
	let token = null

	document.addEventListener('startDisplay', async () => {
		showing = logonRegister
		token = localStorage.getItem('token')
		if (token) {
			//if the user is logged in
			logoff.style.display = 'block'
			const count = await buildTasksTable(
				tasksTable,
				tasksTableHeader,
				token,
				message
			)
			if (count > 0) {
				tasksMessage.textContent = ''
				tasksTable.style.display = 'block'
			} else {
				tasksMessage.textContent = 'There are no task to display for this user.'
				tasksTable.style.display = 'none'
			}
			tasks.style.display = 'block'
			showing = tasks
		} else {
			logonRegister.style.display = 'block'
		}
	})

	var thisEvent = new Event('startDisplay')
	document.dispatchEvent(thisEvent)
	var suspendInput = false

	// section 3

	document.addEventListener('click', async (e) => {
		if (suspendInput) {
			return // we don't want to act on buttons while doing async operations
		}
		if (e.target.nodeName === 'BUTTON') {
			message.textContent = ''
		}
		if (e.target === logoff) {
			localStorage.removeItem('token')
			token = null
			showing.style.display = 'none'
			logonRegister.style.display = 'block'
			showing = logonRegister
			tasksTable.replaceChildren(tasksTableHeader) // don't want other users to see
			message.textContent = 'You are logged off.'
		} else if (e.target === logon) {
			showing.style.display = 'none'
			logonDiv.style.display = 'block'
			showing = logonDiv
		} else if (e.target === register) {
			showing.style.display = 'none'
			registerDiv.style.display = 'block'
			showing = registerDiv
		} else if (e.target === logonCancel || e.target == registerCancel) {
			showing.style.display = 'none'
			logonRegister.style.display = 'block'
			showing = logonRegister
			email.value = ''
			password.value = ''
			name.value = ''
			email1.value = ''
			password1.value = ''
			password2.value = ''
		} else if (e.target === logonButton) {
			suspendInput = true
			try {
				const response = await fetch('/api/v1/auth/login', {
					method: 'POST',
					headers: {
						'Content-Type': 'application/json',
					},
					body: JSON.stringify({
						email: email.value,
						password: password.value,
					}),
				})
				const data = await response.json()
				if (response.status === 200) {
					message.textContent = `Logon successful.  Welcome ${data.user.name}`
					token = data.token
					localStorage.setItem('token', token)
					showing.style.display = 'none'
					thisEvent = new Event('startDisplay')
					email.value = ''
					password.value = ''
					document.dispatchEvent(thisEvent)
				} else {
					message.textContent = data.msg
				}
			} catch (err) {
				message.textContent = 'A communications error occurred.'
			}
			suspendInput = false
		} else if (e.target === registerButton) {
			if (password1.value != password2.value) {
				message.textContent = 'The passwords entered do not match.'
			} else {
				suspendInput = true
				try {
					const response = await fetch('/api/v1/auth/register', {
						method: 'POST',
						headers: {
							'Content-Type': 'application/json',
						},
						body: JSON.stringify({
							name: name.value,
							email: email1.value,
							password: password1.value,
						}),
					})
					const data = await response.json()
					if (response.status === 201) {
						message.textContent = `Registration successful.  Welcome ${data.user.name}`
						token = data.token
						localStorage.setItem('token', token)
						showing.style.display = 'none'
						thisEvent = new Event('startDisplay')
						document.dispatchEvent(thisEvent)
						name.value = ''
						email1.value = ''
						password1.value = ''
						password2.value = ''
					} else {
						message.textContent = data.msg
					}
				} catch (err) {
					message.textContent = 'A communications error occurred.'
				}
				suspendInput = false
			}
		}

		// section 4
		else if (e.target === addingTask) {
			showing.style.display = 'none'
			editTask.style.display = 'block'
			showing = editTask
			delete editTask.dataset.id
			title.value = ''
			description.value = ''
			status.value = 'pending'
			addingTask.textContent = 'add'
		} else if (e.target === editCancel) {
			showing.style.display = 'none'
			title.value = ''
			description.value = ''
			status.value = 'pending'
			thisEvent = new Event('startDisplay')
			document.dispatchEvent(thisEvent)
		} else if (e.target === addingTask) {
			if (!editTask.dataset.id) {
				// this is an attempted add
				suspendInput = true
				try {
					const response = await fetch('/api/v1/tasks', {
						method: 'POST',
						headers: {
							'Content-Type': 'application/json',
							Authorization: `Bearer ${token}`,
						},
						body: JSON.stringify({
							title: title.value,
							description: description.value,
							status: status.value,
						}),
					})
					const data = await response.json()
					if (response.status === 201) {
						//successful create
						message.textContent = 'The task entry was created.'
						showing.style.display = 'none'
						thisEvent = new Event('startDisplay')
						document.dispatchEvent(thisEvent)
						title.value = ''
						description.value = ''
						status.value = 'pending'
					} else {
						// failure
						message.textContent = data.msg
					}
				} catch (err) {
					message.textContent = 'A communication error occurred.'
				}
				suspendInput = false
			} else {
				// this is an update
				suspendInput = true
				try {
					const taskID = editJob.dataset.id
					const response = await fetch(`/api/v1/tasks/${taskID}`, {
						method: 'PATCH',
						headers: {
							'Content-Type': 'application/json',
							Authorization: `Bearer ${token}`,
						},
						body: JSON.stringify({
							title: title.value,
							description: description.value,
							status: status.value,
						}),
					})
					const data = await response.json()
					if (response.status === 200) {
						message.textContent = 'The entry was updated.'
						showing.style.display = 'none'
						title.value = ''
						description.value = ''
						status.value = 'pending'
						thisEvent = new Event('startDisplay')
						document.dispatchEvent(thisEvent)
					} else {
						message.textContent = data.msg
					}
				} catch (err) {
					message.textContent = 'A communication error occurred.'
				}
			}
			suspendInput = false
		}

		// section 5
		else if (e.target.classList.contains('editButton')) {
			editTask.dataset.id = e.target.dataset.id
			suspendInput = true
			try {
				const response = await fetch(`/api/v1/tasks/${e.target.dataset.id}`, {
					method: 'GET',
					headers: {
						'Content-Type': 'application/json',
						Authorization: `Bearer ${token}`,
					},
				})
				const data = await response.json()
				if (response.status === 200) {
					title.value = data.job.title 
					description.value = data.job.description
					status.value = data.job.status
					showing.style.display = 'none'
					showing = editTask
					showing.style.display = 'block'
					addingTask.textContent = 'update'
					message.textContent = ''
				} else {
					// might happen if the list has been updated since last display
					message.textContent = 'The tasks entry was not found'
					thisEvent = new Event('startDisplay')
					document.dispatchEvent(thisEvent)
				}
			} catch (err) {
				message.textContent = 'A communications error has occurred.'
			}
			suspendInput = false
		}
	})
})
