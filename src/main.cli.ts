#!/usr/bin/env node
import { Command } from "commander";

const program = new Command();

program.name("snm").version("0.0.0", "-v, --version");

program.parse();
