# iMessage Bridge Ansible Role

This role installs and configures the mautrix-imessage bridge for Matrix.

## Usage
Add `imessage` to your playbook roles and set any required variables.

## Structure
- `tasks/main.yml`: Main tasks for installing and configuring the bridge
- `templates/`: Place Jinja2 templates for config files here
- `handlers/`: Place handlers (e.g., for restarting services) here

## Note
This role is scaffolded and safe to include in your playbook. It will only run if you add it to your playbook or enable it with a variable.
