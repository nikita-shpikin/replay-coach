export async function deleteBoard(btn, id) {
	setBtnState(btn, true)

	console.log(btn, id)

	setTimeout(() => {
		setBtnState(btn, false)
	}, 1000)
}

function setBtnState(btn, isDeleting) {
	btn.disabled = isDeleting
	btn.style.opacity = isDeleting ? 0.8 : 1
}
