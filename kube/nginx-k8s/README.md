# Nginx Proxy 서버

## 포트 포워딩 설정 : `nginx.conf`

```
events {}

http {
  server {
    listen 3010;
    location / {
      proxy_pass http://175.106.99.210:30130;
      proxy_set_header Host $host;
      proxy_set_header X-Real-IP $remote_addr;
    }
  }

  server {
    listen 3020;
    location / {
      proxy_pass http://175.106.99.210:30140;
      proxy_set_header Host $host;
      proxy_set_header X-Real-IP $remote_addr;
    }
  }

  server {
    listen 8010;
    location / {
      proxy_pass http://175.106.99.210:30110;
      proxy_set_header Host $host;
      proxy_set_header X-Real-IP $remote_addr;
    }
  }

  server {
    listen 8020;
    location / {
      proxy_pass http://175.106.99.210:30120;
      proxy_set_header Host $host;
      proxy_set_header X-Real-IP $remote_addr;
    }
  }
}
```

## 도커 이미지 설정 파일 : `Dockerfile`

```
# Nginx의 stable 버전 사용
FROM nginx:stable

# nginx.conf 파일을 이미지 안으로 복사
COPY nginx.conf /etc/nginx/nginx.conf
```

## 도커 이미지 생성

```bash
docker build -t myproject-nginx .
```

## 도커 컨테이너 생성 및 실행

```bash
docker run -d -p 3010:3010 -p 3020:3020 -p 8010:8010 -p 8020:8020 --name nginx-proxy myproject-nginx
```

## NCP - Container Registry 사용하기

### 로그인 하기

```bash
$ sudo docker login k8s-edu-camp71.kr.ncr.ntruss.com
Username: Access Key ID
Password: Secret Key
```

### 이미지에 태깅하기

```bash
$ sudo docker tag local-image:tagname new-repo:tagname
$ sudo docker tag myproject-nginx k8s-edu-camp71.kr.ncr.ntruss.com/myproject-nginx
```

#### 저장소에 이미지 올리기

```bash
$ sudo docker push k8s-edu-camp71.kr.ncr.ntruss.com/<TARGET_IMAGE[:TAG]>
$ sudo docker push k8s-edu-camp71.kr.ncr.ntruss.com/myproject-nginx
```

## NCP - Ncloud Kubernetes Service 사용하기

### 쿠버네티스가 관리할 리소스 정의: 매니페스트 파일(Kubernetes manifest file) 작성

#### deployment + service 타입 리소스 정의 : `nginx-proxy-deployment.yml`

- kind: Deployment
  - 애플리케이션의 "실행 상태(pod)"를 정의하고 관리하는 리소스
  - 원하는 개수의 Pod 복제본(replica)을 유지
  - 애플리케이션의 롤링 업데이트 및 롤백 지원
  - Pod가 죽으면 자동으로 재생성
- kind: Service
  - Pod 집합에 접근할 수 있는 네트워크 인터페이스를 제공하는 리소스
  - Pod의 IP가 바뀌어도 고정된 접근 지점(ClusterIP, LoadBalancer 등)을 제공
  - 내부에서 접근하거나 외부로 노출하거나 가능
  - Deployment로 생성된 Pod들을 라벨로 선택해서 연결해줌

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: nginx-proxy
spec:
  replicas: 1
  selector:
    matchLabels:
      app: nginx-proxy
  template:
    metadata:
      labels:
        app: nginx-proxy
    spec:
      imagePullSecrets:
        - name: regcred
      containers:
        - name: nginx-proxy
          image: lo20hyy7.kr.private-ncr.ntruss.com/myproject-nginx
          ports:
            - containerPort: 3010
            - containerPort: 3020
            - containerPort: 8010
            - containerPort: 8020
---
apiVersion: v1
kind: Service
metadata:
  name: nginx-proxy
spec:
  type: LoadBalancer
  selector:
    app: nginx-proxy
  ports:
    - name: web3010
      protocol: TCP
      port: 3010
      targetPort: 3010
    - name: web3020
      protocol: TCP
      port: 3020
      targetPort: 3020
    - name: api8010
      protocol: TCP
      port: 8010
      targetPort: 8010
    - name: api8020
      protocol: TCP
      port: 8020
      targetPort: 8020
```

도커 이미지를 지정할 때 Private Endpoint 를 사용하면, 내부 통신으로 다뤄진다.

### 리소스 생성

#### Deployment + Service 리소스 생성

```bash
kubectl2 apply -f nginx-proxy-deployment.yml
```

#### 생성된 리소스 확인

```bash
kubectl2 get secrets
kubectl2 get deployments
kubectl2 get svc
```
