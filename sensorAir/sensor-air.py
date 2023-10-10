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
)

# Enable broadcasting mode
broadcastSocket.bind(("127.0.0.1", 60300))
addressSensor = f"127.0.0.1:60300"

# Send to server using created UDP socket
message = createMessage(type="connection", object="AIR", value=addressSensor)
broadcastSocket.sendto(message, broadcastAddr)

print("broadcast")

# Get ip and port of gateway
data, message = broadcastSocket.recvfrom(bufferSize)
identifier = getObjectFromData(data)

address = identifier.value.split(":")
ipCommunication = address[0]
portCommunication = int(address[1])
print(f"{ipCommunication} {portCommunication}")

air_status = "OFF"
while True:
    
    # Recebe mensagens do Gateway
    data, _ = broadcastSocket.recvfrom(bufferSize)
    received_message = getObjectFromData(data)
    
    # Verifica se a mensagem é um comando para ligar o ar condicionado
    if received_message.type == "command" and received_message.object == "AIR":
        if received_message.value == "ON":
            air_status = "ON"
        elif received_message.value == "OFF":
            air_status = "OFF"

    # Verifica se a mensagem é para configurar a temperatura do ar condicionado
    if received_message.type == "set_temperature" and received_message.object == "AIR":
        new_temperature = float(received_message.value)
        temperature = new_temperature
    
    # Se o ar condicionado estiver ligado, simula ajustes de temperatura
    if air_status == "ON":
        # Simule um pequeno ajuste de temperatura
        random_value = random.uniform(-1, 1)
        temperature += random_value
    
    # Envia o estado atual da ar condicionado para o Gateway
    message = createMessage(
        type="update_value", object="AIR", value=air_status
    )
    broadcastSocket.sendto(message, (ipCommunication, portCommunication))