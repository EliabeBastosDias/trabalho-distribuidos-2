import socket
import chat_pb2 as ChatProto
import random
import time


# Protocol buffers methods
def createMessage(type, object, value):
    messageData = ChatProto.IOTRequest()
    messageData.type = type
    messageData.object = object
    messageData.value = value
    buffer = messageData.SerializeToString()

    return buffer


def getObjectFromData(data):
    message = ChatProto.IOTRequest()
    message.ParseFromString(data)

    return message


port = 60000
broadcastAddr = ("127.0.0.6", port)
bufferSize = 1024

# SOCKET UDP - Broadcast
broadcastSocket = socket.socket(socket.AF_INET, socket.SOCK_DGRAM, socket.IPPROTO_UDP)
broadcastSocket.setsockopt(
    socket.SOL_SOCKET, socket.SO_BROADCAST, 1
)  # Enable broadcasting mode
broadcastSocket.bind(("127.0.0.1", 60100))
addressSensor = f"127.0.0.1:60100"

# Send to server using created UDP socket
message = createMessage(type="connection", object="TEMPERATURE", value=addressSensor)
broadcastSocket.sendto(message, broadcastAddr)

print("broadcast")

# Get ip and port of gateway
data, message = broadcastSocket.recvfrom(bufferSize)
identifier = getObjectFromData(data)

address = identifier.value.split(":")
ipCommunication = address[0]
portCommunication = int(address[1])
print(f"{ipCommunication} {portCommunication}")

valueTemperature = 30
while True:
    time.sleep(3)
    randomValue = random.uniform(-3, 3)
    valueTemperature += randomValue
    message = createMessage(
        type="update_value", object="TEMPERATURE", value=f"{valueTemperature}"
    )
    broadcastSocket.sendto(message, (ipCommunication, portCommunication))
