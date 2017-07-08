var SC3900 = {};

SC3900.init = function (id, debugging) {
  // Platter defaults to not moving
  SC3900.platterMoving = false
}

SC3900.shutdown = function() {
    // nothing
}

SC3900.getDeck = function (group) {
	if (group === "[Channel1]")
    return 1;
	else if (group === "[Channel2]")
		return 2;

	print("Invalid group : " + group);
    return -1;
}

SC3900.movePlatter = function (channel, control, value) {
  // Play button is 0x43. When pressed send 0x66 with a 127 on or 0 off
  if (SC3900.platterMoving === false) {
    (SC3900.platterMoving = true);
    midi.sendShortMsg(0xB0 + channel, 0x66, 127);

  } else {
    (SC3900.platterMoving = false);
    midi.sendShortMsg(0xB0 + channel, 0x66, 0)
  }
}
