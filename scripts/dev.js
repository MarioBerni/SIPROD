#!/usr/bin/env node
const { spawn } = require('child_process');
const chalk = require('chalk');
const inquirer = require('inquirer');
const ora = require('ora');
const path = require('path');

// Configuración de servicios
const services = {
  all: {
    name: 'Todos los servicios',
    command: 'pnpm',
    args: ['dev'],
  },
  web: {
    name: 'Frontend (Next.js)',
    command: 'pnpm',
    args: ['--filter', '@siprod/web', 'dev'],
  },
  api: {
    name: 'Backend (Express)',
    command: 'pnpm',
    args: ['--filter', '@siprod/api', 'dev'],
  },
  monitoring: {
    name: 'Monitoreo (Prometheus + Grafana)',
    command: 'docker-compose',
    args: ['-f', path.join('docker', 'monitoring', 'docker-compose.yml'), 'up'],
  },
};

// Comandos adicionales
const commands = {
  test: {
    name: 'Ejecutar pruebas',
    command: 'pnpm',
    args: ['test'],
  },
  lint: {
    name: 'Ejecutar linting',
    command: 'pnpm',
    args: ['lint'],
  },
  build: {
    name: 'Construir proyecto',
    command: 'pnpm',
    args: ['build'],
  },
};

// Función para ejecutar un comando
function runCommand(command, args, name) {
  return new Promise((resolve, reject) => {
    console.log(chalk.cyan(`\nIniciando ${name}...`));
    
    const child = spawn(command, args, {
      stdio: 'inherit',
      shell: true,
    });

    child.on('error', (error) => {
      console.error(chalk.red(`Error al ejecutar ${name}:`), error);
      reject(error);
    });

    child.on('exit', (code) => {
      if (code === 0) {
        console.log(chalk.green(`\n${name} iniciado correctamente`));
        resolve();
      } else {
        console.error(chalk.red(`\n${name} falló con código de salida ${code}`));
        reject(new Error(`${name} falló con código de salida ${code}`));
      }
    });
  });
}

// Función principal
async function main() {
  try {
    // Mostrar banner
    console.log(chalk.blue.bold('\n=== SIPROD Development CLI ===\n'));

    // Preguntar qué acción realizar
    const { action } = await inquirer.prompt([
      {
        type: 'list',
        name: 'action',
        message: '¿Qué deseas hacer?',
        choices: [
          { name: 'Iniciar servicios', value: 'start' },
          { name: 'Ejecutar comandos', value: 'command' },
          { name: 'Salir', value: 'exit' },
        ],
      },
    ]);

    if (action === 'exit') {
      console.log(chalk.yellow('\n¡Hasta luego!\n'));
      process.exit(0);
    }

    if (action === 'start') {
      // Preguntar qué servicios iniciar
      const { selectedServices } = await inquirer.prompt([
        {
          type: 'checkbox',
          name: 'selectedServices',
          message: '¿Qué servicios deseas iniciar?',
          choices: Object.entries(services).map(([key, service]) => ({
            name: service.name,
            value: key,
          })),
        },
      ]);

      // Iniciar servicios seleccionados
      for (const serviceKey of selectedServices) {
        const service = services[serviceKey];
        await runCommand(service.command, service.args, service.name);
      }
    }

    if (action === 'command') {
      // Preguntar qué comando ejecutar
      const { selectedCommand } = await inquirer.prompt([
        {
          type: 'list',
          name: 'selectedCommand',
          message: '¿Qué comando deseas ejecutar?',
          choices: Object.entries(commands).map(([key, command]) => ({
            name: command.name,
            value: key,
          })),
        },
      ]);

      const command = commands[selectedCommand];
      await runCommand(command.command, command.args, command.name);
    }

  } catch (error) {
    console.error(chalk.red('\nError:'), error);
    process.exit(1);
  }
}

// Ejecutar script
main();
