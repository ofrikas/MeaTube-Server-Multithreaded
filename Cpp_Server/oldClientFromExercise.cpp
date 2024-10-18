#include <iostream>
#include <sys/socket.h>
#include <stdio.h>
#include <netinet/in.h>
#include <arpa/inet.h>
#include <unistd.h>
#include <string.h>

int main() {
    const char *ip_address = "127.0.0.1";
    const int port_no = 5555;

    // Create socket
    int sock = socket(AF_INET, SOCK_STREAM, 0);
    if (sock < 0) {
        perror("Error creating socket");
        return 1;
    }

    // Set up server address
    struct sockaddr_in sin;
    memset(&sin, 0, sizeof(sin));
    sin.sin_family = AF_INET;
    sin.sin_addr.s_addr = inet_addr(ip_address);
    sin.sin_port = htons(port_no);

    // Connect to server
    if (connect(sock, (struct sockaddr *)&sin, sizeof(sin)) < 0) {
        perror("Error connecting to server");
        close(sock);
        return 1;
    }

    // Send data to server
    const char *data_addr = "I'm a message";
    int data_len = strlen(data_addr);
    int sent_bytes = send(sock, data_addr, data_len, 0);
    if (sent_bytes < 0) {
        perror("Error sending data");
        close(sock);
        return 1;
    }

    // Receive response from server
    char buffer[4096];
    int expected_data_len = sizeof(buffer);
    int read_bytes = recv(sock, buffer, expected_data_len, 0);
    if (read_bytes == 0) {
        std::cout << "Connection closed by server" << std::endl;
    } else if (read_bytes < 0) {
        perror("Error receiving data");
        close(sock);
        return 1;
    } else {
        std::cout << "Server sent: " << buffer << std::endl;
    }

    // Close socket
    close(sock);
    return 0;
}