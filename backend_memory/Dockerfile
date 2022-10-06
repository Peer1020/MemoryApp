FROM openjdk:18-jdk-alpine
VOLUME /tmp
ARG JAR_FILE=target/*.jar
COPY ${JAR_FILE} app.jar
CMD ["sh", "-c", "java ${JAVA_OPTS} -jar /app.jar"]