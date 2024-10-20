#include <iostream>
#include <cstring>
#include <arpa/inet.h>
#include <unistd.h>
#include <thread>
#include <unordered_map>
#include <set>
#include <sstream>

// Global map to store user video views
std::unordered_map<std::string, std::set<std::string>> user_video_views;

void handle_client(int client_sock) {
    char buffer[4096];
    while (true) {
        int read_bytes = recv(client_sock, buffer, sizeof(buffer), 0);
        if (read_bytes == 0) {
            std::cout << "Connection closed" << std::endl;
            break;
        } else if (read_bytes < 0) {
            perror("Error receiving data");
            break;
        }
        buffer[read_bytes] = '\0'; // Null-terminate the received data

        // New: Parse and process the message
        std::string message(buffer);
        if (message.find("User") == 0 && message.find("viewed video") != std::string::npos) {
            // This is a video view notification
            std::cout << "Notification: " << message << std::endl;

            // Extract username and video ID from the message
            std::istringstream iss(message);
            std::string user, viewed, video, video_id;
            iss >> user >> user >> viewed >> video >> video_id;

            // Update the map with the new video view
            user_video_views[user].insert(video_id);

            // Print the current state of the map (for debugging)
            std::cout << "Current user video views:" << std::endl;
            for (const auto& pair : user_video_views) {
                std::cout << "User: " << pair.first << " has viewed videos: ";
                for (const auto& vid : pair.second) {
                    std::cout << vid << " ";
                }
                std::cout << std::endl;
            }
        } else {
            // Handle other types of messages
            std::cout << "Received: " << message << std::endl;
        }

        // Echo back the received message
        send(client_sock, buffer, read_bytes, 0);
    }
    close(client_sock);
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