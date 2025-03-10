# Matriarch

**Create, manage and interact with AI agents through your web browser.**

Matriarch delivers a battery-included AI agent experience that's meant to be simple, extensible and future proof. By leveraging the Zerepy protocol, we bring new features and tools to AI Agent.

## Overview

By running Matriarch, you get:

- A complete web application
- A Zerepy-powered backend
- An Echochambers-compliant chat specially modified for human-in-the-loop interactions

## Core Vision

AI Agents are powerful yet complex to run, integrate, and direct—especially when most toolkits expect even power users to run only one agent at a time. These toolkits typically exist in isolation, unable to leverage capabilities built by others.

Matriarch tackles these problems by leveraging Zerepy at its core. Through its integrated web application, Matriarch allows users to create, manage, and interact with multiple agents simultaneously. By bringing Zerepy from the terminal to the web, we're opening AI agent technology to a broader audience.

By providing dedicated LLM endpoints, Matriarch transforms standalone Zerepy agents into available members of a potential cross-toolkit compatible swarm. Running an external agent? Have it query the current available actions of a Matriarch-run agent to access all connections, actions, and their parameters—no problem.

All LLM documentation is automatically generated from available actions and connections, ensuring comprehensive and real-time information.

## Key Technical Features

- **Event Loop Architecture**: Matriarch upgrades Zerepy from thread-based to event loop-based, dramatically scaling up agent handling while maintaining support for legacy Zerepy configuration files
- **Concurrent Agent Management**: Run multiple independent agents simultaneously without loading/unloading
- **JSON Parameter Support**: Agents can now accept JSON parameters, enabling more complex interactions
- **Built-in Crypto Wallets**: Each agent owns a personal crypto wallet that's automatically created
- **Extended Entrypoints**: Additional entrypoints beyond the initial OpenAI implementation allow users to start or resume chats
- **Type Safety**: Pydantic typing, OpenAPI declarations, and code generation provide a safer interface
- **Local Storage**: Chats are saved locally—browser storage for direct agent interactions and SQLite for Echochambers-powered conversations
- **Actions Cheatsheet**: Quick reference for all available actions and their parameters directly from your agent's private chat
- **UI Component Wrappers**: Developers can wrap agent capabilities with helpful UI components

## Watch it Live

[View Demo on YouTube](https://youtu.be/s0BP_HmBONI)
