#include <iostream> // For input and output
#include <cstring> // For memset
#include <arpa/inet.h> // For internet operations
#include <unistd.h> // For close
#include <thread> // For std::thread

void handle_client(int client_sock) { // Function to handle client communication
    char buffer[4096]; // Buffer to store client messages
    while (true) { // Keep handling client messages
        int read_bytes = recv(client_sock, buffer, sizeof(buffer), 0); // Receive message from client
        if (read_bytes == 0) { // Check if connection is closed by client
            std::cout << "Connection closed" << std::endl;
            break; // Exit loop if connection is closed
        } else if (read_bytes < 0) { // Check for receive error
            perror("Error receiving data");
            break; // Exit loop if error occurred
        }
        buffer[read_bytes] = '\0'; // Null-terminate the received data
        std::cout << "Received: " << buffer << std::endl; // Print received message
        send(client_sock, buffer, read_bytes, 0); // Echo back the received message
    }
    close(client_sock); // Close client socket
}

int main() {
    const int server_port = 5555; // Server port number
    int sock = socket(AF_INET, SOCK_STREAM, 0); // Create socket

    if (sock < 0) { // Check if socket creation failed
        perror("Error creating socket");
        return 1;
    }

    struct sockaddr_in sin; // Socket address structure
    memset(&sin, 0, sizeof(sin)); // Clear structure
    sin.sin_family = AF_INET; // Set address family to Internet
    sin.sin_addr.s_addr = INADDR_ANY; // Accept connections from any IP
    sin.sin_port = htons(server_port); // Set server port

    if (bind(sock, (struct sockaddr *)&sin, sizeof(sin)) < 0) { // Bind socket to address
        perror("Error binding socket");
        return 1;
    }

    if (listen(sock, 5) < 0) { // Listen for incoming connections
        perror("Error listening to a socket");
        return 1;
    }

    while (true) { // Main loop to accept clients
        struct sockaddr_in client_sin; // Client address structure
        unsigned int addr_len = sizeof(client_sin); // Address length
        int client_sock = accept(sock, (struct sockaddr *)&client_sin, &addr_len); // Accept client connection

        if (client_sock < 0) { // Check if accept failed
            perror("Error accepting client");
            continue; // Continue to next iteration if error occurred
        }

        std::thread(handle_client, client_sock).detach(); // Create and detach thread to handle client
    }

    close(sock); // Close server socket
    return 0;
}