
# IOT Project
Dự án IOT sử dụng mạch ESP8266, cảm biến dht11, quang trở để đo, quản lý nhiệt độ, độ ẩm và ánh sáng, kèm với bật tắt, quản lý 02 thiết bị: đèn và quạt:
- Thông tin về nhiệt độ, độ ẩm và ánh sáng sẽ được cảm biến thu lại ở phần cứng. Sau đó thông tin sẽ được xử lý ở server và hiển thị trực quan hoá trên giao diện web người dùng. 
- Người dùng có thể thực hiện chức năng bật/tắt các thiết bị đèn, quạt trên giao diện web, các yêu cầu sau đó sẽ được xử lý ở server và gửi về phần cứng để thực hiện yêu cầu.


## Deployment
## ***Server***


**Bước 1: Clone dự án trên Github**

```bash
  git clone https://github.com/hmquan87/iot
```
**Bước 2: Setup nodejs**
- Cài đặt nodejs : `https://nodejs.org/en/download/current`

**Bước 3: Kết nối tới hệ quản trị cơ sở dữ liệu MySQL**
- Chỉnh sửa các thông tin tới database của bạn: username, password, database name, host.



**Bước 4: Build and run**

```bash
  npm i
```

```bash
 npm start
```

## ***Client***
**Bước 1: Cài node_modules**
```bash
  npm i
```

**Bước 2: Chạy dự án**

```bash
  npm start
```

## ***Hardware ESP8266***
**Bước 1: Cài đặt Arduino và setup Arduino**
- Tham khảo cách làm: `http://arduino.vn/bai-viet/68-cai-dat-driver-va-arduino-ide`
  
**Bước 2: Cài đặt và setup MQTT Broker**
- Tham khảo cách làm: `https://ngocautomation.com/tai-va-cai-dat-mqtt-broker-mosquitto/`

**Bước 3: Kết nối và nạp code vào mạch ESP8266**

