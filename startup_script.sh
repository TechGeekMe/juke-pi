#!/bin/bash
rm -rf uploads/*
./mpc update --wait
./mpc add default.mp3
./mpc single on
./mpc consume on
./mpc play
node index.js
