/**
 * Denon SC3900 controller script alpha for Mixxx 2.0.0
 * Copyright (C) 2017 Matthias Johnson matthias.a.johnson@gmail.com
 *
 * Thanks to https://github.com/Be-ing, https://github.com/Pegasus-RPG,
 * https://github.com/mindhog, and https://github.com/kitschysynq
 * for talking through some of the problems this controller presents
 *
 * This program is free software; you can redistribute it and/or
 * modify it under the terms of the GNU General Public License
 * as published by the Free Software Foundation; either version 2
 * of the License, or (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program; if not, write to the Free Software
 * Foundation, Inc., 51 Franklin Street, Fifth Floor, Boston, MA  02110-1301, USA.
 See http://mixxx.org/wiki/doku.php/electrix_tweaker for instructions on how to use this mapping
**/

var SC3900 = {};


SC3900.init = function (id, debugging) {
  SC3900.platterMoving = false
  var alpha = 1.0/8;
  var beta = alpha/32;
  engine.scratchEnable(1, 3600, 33+1/3, alpha, beta);

}

SC3900.shutdown = function() {
    // nothing
}

SC3900.getDeck = function (channel, control, value, status, group) {
	if (group === "[Channel1]")
    return 1;
	else if (group === "[Channel2]")
		return 2;

	print("Invalid group : " + group);
    return -1;
}

SC3900.movePlatter = function (channel, control, value, status, group) {
  // Play button is 0x43. When pressed send 0x66 with a 127 on or 0 off
  if (SC3900.platterMoving === false) {
    (SC3900.platterMoving = true);
    midi.sendShortMsg(0xB0 + channel, 0x66, 127);
    engine.scratchTick

  } else {
    (SC3900.platterMoving = false);
    midi.sendShortMsg(0xB0 + channel, 0x66, 0)
  }
}


// The wheel that actually controls the scratching
SC3900.wheelTurn = function (channel, control, value, status, group) {
    // B: For a control that centers on 0x40 (64):
    var newValue = value - 64;

    // Register the movement
    if (engine.isScratching(1)) {
        engine.scratchTick(1, newValue); // Scratch!
    } else {
        engine.setValue('[Channel'+1+']', 'jog', newValue); // Pitch bend
    }
}
