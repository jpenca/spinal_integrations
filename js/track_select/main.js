var trackSelect

window.addEventListener('load', () => {
    trackSelect = new TrackSelect(document.getElementById('trackselect'))
})

class TrackSelect {
    constructor(node) {
        this.trackLabels = [
            'BD','SD','RS','CP',
            'BT','LT','MT','HT',
            'CH','OH','CY','CB']

        this.parentNode = node
        this.mouseIsDown = false
        this.lastSelectedTrack = -1
        this.selectActive = false

        this.tracks = []
        for(var i = 0; i < 12; i++) {
            this.tracks.push(false)
        }

        this.trackCells = []
        this.buildGrid()
        this.updateSelectionFromLocalStorage()

        this.touchIDs = {}
        
        this.parentNode.addEventListener('mousedown', this.mDown)
        this.parentNode.addEventListener('mouseup', this.mUp)
        this.parentNode.addEventListener('mousemove', this.mMoved)

        this.parentNode.addEventListener('touchstart', this.tDown)
        this.parentNode.addEventListener('touchend', this.tEnd)
        this.parentNode.addEventListener('touchcancel', this.tCancel)
        this.parentNode.addEventListener('touchmove', this.tMoved)
    }

    buildGrid() {
        console.log('building grid..')
        var table = document.createElement('table')
        table.setAttribute('class', 'trackselecttable')

        this.parentNode.appendChild(table)

        var tk = 0
        for(var y = 0; y < 3; y ++) {
            var row = table.insertRow(0)

            for (var x = 0; x < 4; x ++ ) {
                var cell = row.insertCell()
                var div = document.createElement('div')
                div.setAttribute('class', 'trackselecttrack')
                div.setAttribute('selected', this.tracks[tk])
                cell.appendChild(div)
                this.trackCells.push(div)
                div.innerHTML = this.trackLabels[tk]
                tk++
            }
        }
    }

    trackIndex(x, y) {

        for(var i = 0; i < this.trackCells.length; i++) {
            var div = this.trackCells[i]
            var rect = div.getBoundingClientRect()
            // console.log(`rect:`, rect)
            if(
                rect.top <= y 
            && rect.bottom >= y 
            && rect.left <= x 
            && rect.right >= x) {
                // console.log(`mouse inside ${i}!`)
                return i;
            }
        }

        return -1
    }

    mDown(event) {
        console.clear()
        // console.log(`mouse down at ${event.clientX}/${event.clientY}`)
        trackSelect.lastSelectedTrack = -1
        trackSelect.mouseIsDown = true
        trackSelect.handleChanged(event.clientX, event.clientY)
    }

    mOut(event) {
        // console.log(`mouse out!`)
        trackSelect.mouseIsDown = false
    }

    mUp(event) {
        // console.log(`mouse up!`)
        trackSelect.mouseIsDown = false
    }

    mMoved(event) {
        // console.log(`mouse moved!`)
        if(trackSelect.mouseIsDown)
            trackSelect.handleChanged(event.clientX, event.clientY)
    }


    tDown(event) {
        // console.clear()
        event.preventDefault()
        var touches = event.changedTouches
        for(var i = 0; i < touches.length; i++) {
            var touch = touches.item(i)
            var idx = trackSelect.trackIndex(touch.clientX, touch.clientY)
            trackSelect.touchIDs[touch.identifier] = idx
            if(idx != -1) {
                trackSelect.tracks[idx] = !trackSelect.tracks[idx]    
                trackSelect.trackCells[idx].setAttribute('selected', trackSelect.tracks[idx])
                trackSelect.updateLocalStorage()
                trackSelect.touchIDs[touch.identifier] = idx
            }
        }

        // console.log(`touch IDs`, trackSelect.touchIDs)
    }

    tMoved(event) {
        // console.log(`touch moved!`)
        event.preventDefault()
        var touches = event.changedTouches;

        for(var i = 0; i < touches.length; i++) {
            var touch = touches.item(i)
            var ident = touch.identifier
            var prevIdx = trackSelect.touchIDs[ident];
            var idx = trackSelect.trackIndex(touch.clientX, touch.clientY)

            if(idx != -1 && prevIdx != idx) {
                trackSelect.tracks[idx] = !trackSelect.tracks[idx]    
                trackSelect.trackCells[idx].setAttribute('selected', trackSelect.tracks[idx])
                trackSelect.updateLocalStorage()
            }

            trackSelect.touchIDs[touch.identifier] = idx
        }
    }

    tEnd(event) {
        var touches = event.changedTouches;
        for(var i = 0; i < touches.length; i++) {
            var touch = touches.item(i)
            delete trackSelect.touchIDs[touch.identifier]    
        }
    }

    tCancel(event) {
        var touches = event.changedTouches;
        for(var i = 0; i < touches.length; i++) {
            var touch = touches.item(i)
            delete trackSelect.touchIDs[touch.identifier]    
        }
    }

    handleChanged(cx, cy) {
        var idx = this.trackIndex(cx, cy)
        if(idx != -1 && idx != this.lastSelectedTrack) {
            this.tracks[idx] = !this.tracks[idx]
            this.trackCells[idx].setAttribute('selected', trackSelect.tracks[idx])
            this.lastSelectedTrack = idx
            trackSelect.updateLocalStorage()
        }
    }

    updateLocalStorage() {
        localStorage.setItem('selectedtracks', JSON.stringify(this.tracks))
    }

    updateSelectionFromLocalStorage() {
        var item = localStorage.getItem('selectedtracks')
        if(item) {
            this.tracks = JSON.parse(item)
            for(var trk = 0; trk < 12; trk ++) {
                this.trackCells[trk].setAttribute('selected', this.tracks[trk])
            }
        }
    }
}