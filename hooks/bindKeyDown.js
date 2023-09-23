import { useEffect } from "react"

export const useBindKeyDown = (handleKeyDown) => {

    useEffect(() => {
        bindKeyDown()
        return () => {
            unbindKeyDown()
        }
    }, [])

    function bindKeyDown() {
        document.addEventListener("keydown", handleKeyDown)
    }

    function unbindKeyDown() {
        document.removeEventListener("keydown", handleKeyDown)
    }

    return [
        bindKeyDown,
        unbindKeyDown
    ]
}