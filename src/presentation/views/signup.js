(() => {
  function readSearch () {
    const searchParams = new URLSearchParams(window.location.search)
    const query = Object.fromEntries(searchParams.entries())

    for (const [key, value] of searchParams.entries()) {
      const el = document.getElementById(key)
      if (!el || el.tagName.toLowerCase() !== 'input') continue

      el.setAttribute('value', value)
    }

    history.replaceState({}, document.title, location.href.split('?')[0])
  }

  function buildData () {
    const properties = Array.from(document.getElementsByTagName('input'))
      .filter(field => field.type !== 'hidden')
      .reduce((data, field) => {
        data[field.name] = field.value
        return data
      }, {})

    const externalIdSource = document.getElementById('externalIdSource')
    const externalId = document.getElementById('externalId')

    if (!externalId || !externalIdSource || !externalId.value || !externalIdSource.value) return properties

    properties.externalIds = {
      [externalIdSource.value]: externalId.value
    }

    return properties
  }

  /**
   * Handles a click on the submit button
   * @param {Event} e Click event
   */
  function sendData (e) {
    e.preventDefault()
    const data = buildData()
    const { name, username, password, confirm } = data

    if (password !== confirm) return alert('As senhas não conferem!')

    const missingField = Object.entries(data)
      .filter(([key]) => key !== 'externalIds')
      .find(([key, value]) => !(value.trim()))

    if (missingField) return alert('Preencha todos os campos!')

    e.target.setAttribute('disabled', true)
    fetch('/sign-up', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    })
      .then(response => response.json())
      .then(({ token }) => {
        alert('Usuário criado com sucesso!')
        localStorage.setItem('token', token)
        e.target.setAttribute('disabled', false)
        location.pathname = '/success'
      })
      .catch(err => {
        console.error(err)
        e.target.setAttribute('disabled', false)
      })
  }

  function setHandlers () {
    const submit = document.getElementById('submit')
    if (!submit) return

    submit.addEventListener('click', sendData)
  }

  readSearch()
  setHandlers()
})()
