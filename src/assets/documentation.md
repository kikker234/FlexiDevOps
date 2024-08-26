# FlexiAPI Devops Panel Documentation
Welcome to the documentation and accountabillity of the FlexiAPI Devops Panel.
<br><br>

## Why did I build it?
While I was having my summer break I build FlexiAPI. This is an API where you can hand in an so called Entity Map which contains
the models, relations and validation fields of you application. This API will then generate a REST API for you. The reason I 
created this was because frontend developers can create basic CRUD applications without the need of a backend developer.
<br><br>
As I was looking into devops I saw that there were a lot of tools on the market for all different use cases. Because
I was interested in a lot of them myself, I installed a couple of open source ones (grafana, prometheus, etc). And quickly
I didn't know what was running where and how to manage them. So I created the FlexiAPI Devops Panel to manage all my devops
applications, including a basic logging system.
<br><br>

## How did I build it?
I started out creating a simple Vite project using Svelte. I used Svelte for a bit in the past but I wanted to dive deeper 
and learn more about it. I also used TailwindCSS with DaisyUI for the styling of the application.
<br><br>
Halfway through I encountered the problem that I needed to run a backend server to get the data from the logs so I could
parse them. I decided to use ExpressJS for this. I created a simple ExpressJS server that would read the logs and send them
<br><br>

## What did I learn?
First of all I got a lot better at Svelte itself. The main thing I learned was the reactivity of Svelte. I also learned how
to use TailwindCSS with DaisyUI. I also learned how to create a simple ExpressJS server that would read the logs and send them
to the frontend using the streaming API.
<br><br>

## What can I do better next time?
I think I could have done a better job at the ExpressJS server. I think I could have made it more efficient and more secure.
I also think I could have done a better job at the Svelte components. I think I could have made them more reusable and more
efficient. Also I could have planned the project better. I think I could have made a better plan on what I wanted to do and
how I wanted to do it.
<br><br>

## Functionality

## Non functional requirements
The following non functional requirements are met by the FlexiAPI Devops Panel:
- The FlexiAPI Devops Panel is a web application that can be accessed from any device with a browser.
- The FlexiAPI Devops Panel is a responsive web application that can be accessed from any device with a browser.
- The Panel is 

## Testing