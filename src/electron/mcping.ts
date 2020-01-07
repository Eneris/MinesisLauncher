import net from "net"
import dns from "dns"

const MC_DEFAULT_PORT = 25565

function CustomBuffer(existingBuffer?) {
    var buffer = existingBuffer || Buffer.alloc(48)
    var offset = 0

    this.writeVarInt = function(val) {
        while (true) {
            if ((val & 0xFFFFFF80) == 0) {
                this.writeUByte(val)

                return
            }

            this.writeUByte(val & 0x7F | 0x80)

            val = val >>> 7
        }
    }

    this.writeString = function(string) {
        this.writeVarInt(string.length)

        if (offset + string.length >= buffer.length) {
            Buffer.concat([buffer, Buffer.from(string.length)])
        }

        buffer.write(string, offset, string.length, "UTF-8")

        offset += string.length
    }

    this.writeUShort = function(val) {
        this.writeUByte(val >> 8)
        this.writeUByte(val & 0xFF)
    }

    this.writeUByte = function(val) {
        if (offset + 1 >= buffer.length) {
            Buffer.concat([buffer, Buffer.alloc(50)])
        }

        buffer.writeUInt8(val, offset++)
    }

    this.readVarInt = function() {
        var val = 0
        var count = 0

        while (true) {
            var i = buffer.readUInt8(offset++)

            val |= (i & 0x7F) << count++ * 7

            if ((i & 0x80) != 128) {
                break
            }
        }

        return val
    }

    this.readString = function() {
        var length = this.readVarInt()
        var str = buffer.toString("UTF-8", offset, offset + length)

        offset += length
        
        return str
    }

    this.buffer = function() {
        return buffer.slice(0, offset)
    }

    this.offset = function() {
        return offset
    }
}

function ping(server: string, port: any, callback?: Function, timeout?: number, protocol?: number) {

    if (typeof port == "function") {
        callback = port
        port = MC_DEFAULT_PORT
    }

    if (typeof port !== "number") {
        port = MC_DEFAULT_PORT
    }

    if (typeof timeout == "undefined") {
        timeout = 3000
    }

    // Use the specified protocol version, if supplied
    if (typeof protocol !== "number") {
        protocol = 47
    }

    dns.resolveSrv('_minecraft._tcp.' + server, function (err, record) {
        let connectTo = {
            port: port,
            host: server
        }

        if (!err && 0 < record.length) {
            connectTo = {
                host: record[0].name,
                port: record[0].port
            }
        }

        let socket = net.connect(connectTo, function () {
            // Write out handshake packet.
            let handshakeBuffer = new CustomBuffer()

            handshakeBuffer.writeVarInt(0)
            handshakeBuffer.writeVarInt(protocol)
            handshakeBuffer.writeString(server)
            handshakeBuffer.writeUShort(port)
            handshakeBuffer.writeVarInt(1)

            writePCBuffer(socket, handshakeBuffer)

            // Write the set connection state packet, we should get the MOTD after this.
            let setModeBuffer = new CustomBuffer()

            setModeBuffer.writeVarInt(0)

            writePCBuffer(socket, setModeBuffer)
        })

        socket.setTimeout(timeout, function () {
            if (callback) {
                callback(new Error("Socket timed out when connecting to " + server + ":" + port), null)
            }

            socket.destroy()
        })

        let readingBuffer = Buffer.alloc(0)

        socket.on('data', function (data) {
            readingBuffer = Buffer.concat([readingBuffer, data])

            let buffer = new CustomBuffer(readingBuffer)
            let length

            try {
                length = buffer.readVarInt()
            } catch (err) {
                // The buffer isn't long enough yet, wait for more data!
                return
            }

            // Make sure we have the data we need!
            if (readingBuffer.length < length - buffer.offset()) {
                return
            }

            // Read the packet ID, throw it away.
            buffer.readVarInt()

            try {
                let json = JSON.parse(buffer.readString())

                // We parsed it, send it along!
                callback(null, json)
            } catch (err) {
                // Our data is corrupt? Fail hard.
                callback(err, null)

                return
            }

            // We're done here.
            socket.destroy()
        })

        socket.once('error', function (err) {
            if (callback) {
                callback(err, null)
            }

            socket.destroy()
        })
    })


}

// Wraps our Buffer into another to fit the Minecraft protocol.
function writePCBuffer(client, buffer) {
    let length = new CustomBuffer()

    length.writeVarInt(buffer.buffer().length)

    client.write(Buffer.concat([length.buffer(), buffer.buffer()]))
}

export default ping