#include <iostream>
#include <cstring>
#include <arpa/inet.h>
#include <unistd.h>
#include <thread>
#include <unordered_map>
#include <set>
#include <sstream>
#include <vector>

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
        buffer[read_bytes] = '\0';
        std::string message(buffer);
        if (message.find("User") == 0 && message.find("viewed video") != std::string::npos) {
            std::cout << "Notification: " << message << std::endl;
            std::istringstream iss(message);
            std::string user, viewed, video, video_id;
            iss >> user >> user >> viewed >> video >> video_id;
            user_video_views[user].insert(video_id);
            std::cout << "Current user video views:" << std::endl;
            for (const auto &pair : user_video_views) {
                std::cout << "User: " << pair.first << " has viewed videos: ";
                for (const auto &vid : pair.second) {
                    std::cout << vid << " ";
                }
                std::cout << std::endl;
            }
        } else if (message.find("user") == 0 && message.find("getTop20") != std::string::npos) {
            std::istringstream iss(message);
            std::string user, getTop20;
            iss >> user >> user >> getTop20;
            std::cout << "Debug: Extracted username: " << user << std::endl;
            std::string max_match_user;
            int max_matches = 0;
            for (const auto &pair : user_video_views) {
                if (pair.first != user) {
                    int matches = 0;
                    for (const auto &vid : pair.second) {
                        if (user_video_views[user].find(vid) != user_video_views[user].end()) {
                            matches++;
                        }
                    }
                    if (matches > max_matches) {
                        max_matches = matches;
                        max_match_user = pair.first;
                    }
                }
            }
            std::cout << "Debug: User with maximum matches: " << max_match_user << " with " << max_matches << " matches" << std::endl;
            std::vector<std::string> recommendations;
            if (!max_match_user.empty()) {
                for (const auto &vid : user_video_views[max_match_user]) {
                    if (user_video_views[user].find(vid) == user_video_views[user].end()) {
                        recommendations.push_back(vid);
                        if (recommendations.size() == 10)
                            break;
                    }
                }
            }
            std::cout << "Debug: Recommendations: ";
            for (const auto &vid : recommendations) {
                std::cout << vid << " ";
            }
            std::cout << std::endl;
            std::ostringstream oss;
            for (const auto &vid : recommendations) {
                oss << vid << " ";
            }
            std::string response = oss.str();
            std::cout << "Debug: Response to be sent: " << response << std::endl;
            if (response.empty()) {
                response = "No recommendations";
            }
            int sent_bytes = send(client_sock, response.c_str(), response.size(), 0);
            if (sent_bytes < 0) {
                perror("Error sending data");
            } else {
                std::cout << "Debug: Sent success: " << response << std::endl;
            }
        } else {
            std::cout << "Received: " << message << std::endl;
        }
    }
    close(client_sock);
}

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

    while (true) {
        struct sockaddr_in client_sin;
        unsigned int addr_len = sizeof(client_sin);
        int client_sock = accept(sock, (struct sockaddr *)&client_sin, &addr_len);
        if (client_sock < 0) {
            perror("Error accepting client");
            continue;
        }
        std::thread(handle_client, client_sock).detach();
    }

    close(sock);
    return 0;
}