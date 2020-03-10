(() => {
  const token = localStorage.getItem('token')

  if (!token) {
    location.pathname = '/login'
    return
  }

  const tokenDisplay = document.getElementById('tokenDisplay')

  if (!tokenDisplay) {
    alert('erro')
    return
  }

  tokenDisplay.innerText = token

  const logoutButton = document.getElementById('logout')

  if (!logoutButton) return

  logoutButton.addEventListener('click', (e) => {
    e.preventDefault()
    localStorage.removeItem('token')
    location.pathname = '/login'
  })
})()
