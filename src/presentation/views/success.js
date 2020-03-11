(() => {
  const searchParams = new URLSearchParams(location.search)
  if (searchParams.has('token')) {
    localStorage.setItem('token', searchParams.get('token'))
    setTimeout(() => {
      history.replaceState({}, document.title, location.href.split('?')[0])
    }, 0)
  }

  const token = searchParams.get('token') || localStorage.getItem('token')

  if (!token) {
    location.pathname = '/login'
    return
  }

  function setLogout () {
    const logoutButton = document.getElementById('logout')

    if (!logoutButton) return

    logoutButton.addEventListener('click', (e) => {
      e.preventDefault()
      localStorage.removeItem('token')
      location.pathname = '/login'
    })
  }

  function displayToken () {
    const tokenDisplay = document.getElementById('tokenDisplay')

    if (!tokenDisplay) {
      alert('erro')
      return
    }

    tokenDisplay.innerText = token
  }

  function displayUserInfo () {
    const userInfoDisplay = document.getElementById('userInfo')

    if (!userInfoDisplay) return

    fetch('/me', { method: 'GET', headers: { 'Authorization': token, 'Content-Type': 'application/json' } })
      .then(response => response.json())
      .then(userInfo => {
        userInfoDisplay.innerText = JSON.stringify(userInfo, null, 4)
      })
  }

  setLogout()
  displayToken()
  displayUserInfo()
})()
