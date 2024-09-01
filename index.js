// Get HTML elements
let turbiditas = document.getElementById("turbiditas");
let suhu = document.getElementById("suhu");
let humidity = document.getElementById("humidity");
let gyroX = document.getElementById("gyroX");
let gyroY = document.getElementById("gyroY");
let gyroZ = document.getElementById("gyroZ");

// MQTT broker configuration
const clientId = "mqttjs_" + Math.random().toString(16).substr(2, 8);
const url = "wss://broker.emqx.io:8084/mqtt";
const topicSensor = "mqtt/sensorhehehehedata";

// MQTT client options
const options = {
  keepalive: 60,
  clientId: clientId,
  protocolId: "MQTT",
  protocolVersion: 4,
  clean: true,
  reconnectPeriod: 1000,
  connectTimeout: 30 * 1000,
  will: {
    topic: "WillMsg",
    payload: "Connection Closed abnormally..!",
    qos: 0,
    retain: false,
  },
};

console.log("Connecting MQTT client...");
const client = mqtt.connect(url, options);

client.on("error", (err) => {
  console.error("Connection error: ", err);
  client.end();
});

client.on("reconnect", () => {
  console.log("Reconnecting...");
});

client.on("connect", () => {
  console.log(`Client connected: ${clientId}`);
  client.subscribe(topicSensor, { qos: 0 }, (err) => {
    if (err) {
      console.error("Subscribe error:", err);
    } else {
      console.log(`Subscribed to topic: ${topicSensor}`);
    }
  });
});

client.on("message", (topic, message) => {
  console.log(`Received Message: ${message.toString()} on topic: ${topic}`);

  if (topic === topicSensor) {
    try {
      let data = JSON.parse(message.toString());

      // Ensure the data structure is correct
      if (
        data.Turbidity !== undefined &&
        data.Temperature !== undefined &&
        data.Humidity !== undefined &&
        data.X !== undefined &&
        data.Y !== undefined &&
        data.Z !== undefined
      ) {
        // Update HTML elements with data
        turbiditas.innerText = `Turbidity: ${data.Turbidity}`;
        suhu.innerText = `Temperature: ${data.Temperature}`;
        humidity.innerText = `Humidity: ${data.Humidity}`;
        gyroX.innerText = `Gyro X: ${data.X}`;
        gyroY.innerText = `Gyro Y: ${data.Y}`;
        gyroZ.innerText = `Gyro Z: ${data.Z}`;
      } else {
        console.error("Unexpected data structure:", data);
      }
    } catch (e) {
      console.error("Failed to parse message:", e);
    }
  }
});
