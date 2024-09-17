#include <iostream>
#include <cstring>
#include <arpa/inet.h>
#include <unistd.h>

int main() {
    const int server_port = 5555;
    int sock = socket(AF_INET, SOCK_STREAM, 0);

    if (sock < 0) {
        perror("Error creating socket");
        return 1;
    }

    struct sockaddr_in sin;
    memset(&sin, 0, sizeof(sin));
    sin.sin_family = AF_INET;
    sin.sin_addr.s_addr = INADDR_ANY;
    sin.sin_port = htons(server_port);

    if (bind(sock, (struct sockaddr *)&sin, sizeof(sin)) < 0) {
        perror("Error binding socket");
        return 1;
    }

    if (listen(sock, 5) < 0) {
        perror("Error listening to a socket");
        return 1;
    }

    struct sockaddr_in client_sin;
    unsigned int addr_len = sizeof(client_sin);
    int client_sock = accept(sock, (struct sockaddr *)&client_sin, &addr_len);

    if (client_sock < 0) {
        perror("Error accepting client");
        return 1;
    }

    char buffer[4096];
    int expected_data_len = sizeof(buffer);
    int read_bytes = recv(client_sock, buffer, expected_data_len, 0);

    if (read_bytes == 0) {
        std::cout << "Connection closed" << std::endl;
    } else if (read_bytes < 0) {
        perror("Error receiving data");
    } else {
        std::cout << buffer;
    }

    int sent_bytes = send(client_sock, buffer, read_bytes, 0);

    if (sent_bytes < 0) {
        perror("Error sending to client");
    }

    close(sock);
    return 0;
}