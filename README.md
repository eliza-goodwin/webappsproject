# My Project

## Meal Planner

### Plans

Attributes:

- Day
- Name of meal
- Date
- Servings
- Category

## Schema
```sql
CREATE TABLE plans (
    ID INTEGER PRIMARY KEY,
    day TEXT,
    name TEXT,
    date TEXT,
    serving INTEGER,
    category TEXT
);
```
### REST Endpoints
| Name                 | Method  | Path         |
|----------------------|---------|--------------|
| Retrieve all plans   | GET     | /plans       |
| Retrieve plan member | GET     | /plans/\<id> |
| Create plan member   | POST    | /plans       |
| Update plan member   | PUT     | /plans/\<id> |
| Delete plan member   | DELETE  | /plans/\<id> |


[Link to external site where I spent a lot of time](https://css-tricks.com/snippets/css/complete-guide-grid/#prop-grid-template-columns-rows)

# Planner

## Resource

**Planner**

Attributes:

- name (string)
- date (string)
- desc (string)
- course (string)
- notes (string)

## Schema

```sql
CREATE TABLE planner (
    id INTEGER PRIMARY KEY,
    name TEXT,
    date TEXT,
    desc TEXT,
    course TEXT,
    notes TEXT
);
```

## REST Endpoints

| Name                         | Method  | Path                        |
|------------------------------|---------|-----------------------------|
| Retrieve homework collection | GET     | /homework                   |
| Retrieve homework member     | GET     | /homework/<int:homework_id> |
| Create homework member       | POST    | /homework                   |
| Update homework member       | PUT     | /homework/<int:homework_id> |
| Delete homework member       | DELETE  | /homework/<int:homework_id> |
| Handle CORS                  | OPTIONS | /homework/<int:homework_id> |

## Deployment Guide

**Prerequisites:**

- Docker installed and running.
- Logged in to Docker Hub (`docker login`).
- MicroK8s installed (See bottom for install)
- Ingress enabled (EX: `microk8s enable dns dashboard ingress`)

**Steps:**

In ingress.yaml change it to the domain you wish for it to have (In this case eliza.zorran.tech)


### Applying Kubernetes YAML Files

The `deploy.sh` script applies the necessary Kubernetes YAML files if you say yes to deploy:

- `contour.yaml`: Namespace and necessary roles and bindings. (Uses eliza namespace to avoid coflicts with other contours)
- `backend-deployment.yaml`: Deployment and service for the backend application. (Under the name: elizabackend)
- `frontend-deployment.yaml`: Deployment and service for the frontend application. (Under the name: elizafrontend)
- `ingress.yaml`: Ingress configurations for routing.
  

### Updating Hosts File for Local Testing

If you wish to run the application locally and need to map your domain to your local machine's IP address, update your hosts file.

**Example Entry:**

```
<your-machine-ip>  www.example.com
```

Replace `<your-machine-ip>` with your machine's actual IP address.

#### Instructions for Different Operating Systems

**Windows**

1. Open Notepad as an administrator.
2. Navigate to `C:\Windows\System32\drivers\etc`.
3. Open the `hosts` file.
4. Add the following line at the end:

   ```
   <your-machine-ip>  www.example.com
   ```

5. Save the file.

**macOS and Linux**

1. Open a terminal.
2. Edit the hosts file with root privileges:

   ```bash
   sudo nano /etc/hosts
   ```

3. Add the following line at the end:

   ```
   <your-machine-ip>  www.example.com
   ```

4. Save and exit the editor.

**Note:** Modifying the hosts file requires administrative privileges.

### Installing Kubernetes (MicroK8s) and Enabling Ingress

To deploy the application on Kubernetes, you need to install Kubernetes and enable ingress. You can use MicroK8s for a lightweight Kubernetes installation. Here are the steps to install MicroK8s on Ubuntu:

1. **Update your system:**

   ```bash
   sudo apt update
   sudo apt upgrade -y
   ```

2. **Install MicroK8s:**

   ```bash
   sudo snap install microk8s --classic
   ```

3. **Add your user to the MicroK8s group:**

   ```bash
   sudo usermod -a -G microk8s $USER
   sudo chown -f -R $USER ~/.kube
   ```

4. **Log out and back in to apply the group change.**

5. **Check the status of MicroK8s:**

   ```bash
   microk8s status --wait-ready
   ```

6. **Enable necessary MicroK8s add-ons:**

   ```bash
   microk8s enable dns dashboard ingress
   ```

7. **Verify the installation:**

   ```bash
   microk8s kubectl get all --all-namespaces
   ```

You now have a running Kubernetes cluster with ingress enabled.
