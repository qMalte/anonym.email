"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GameServerDetails = exports.OutputParser = void 0;
const LoggingHelper_1 = require("../../../helpers/LoggingHelper");
class OutputParser {
    constructor() {
        this._log = new LoggingHelper_1.LoggingHelper(__dirname);
    }
    serverDetails(rawOutput) {
        try {
            const withoutColors = rawOutput.replace(/[\u001b\u009b][[()#;?]*(?:[0-9]{1,4}(?:;[0-9]{0,4})*)?[0-9A-ORZcf-nqry=><]/g, '');
            const withoutWhitespaces = withoutColors.replace(/\n\n+/g, '\n');
            let rows = withoutWhitespaces.split('\n');
            rows = rows.filter(x => x != '');
            rows = rows.map(x => x.replace(/\s+/g, ''));
            const values = rows.map(x => x.split(':'));
            const OneCellArray = values.filter(x => x.length == 1);
            const TwoCellArray = values.filter(x => x.length >= 2);
            const details = new GameServerDetails();
            OneCellArray.forEach(value => {
                if (value[0].toLowerCase().startsWith('game')) {
                    details.gamePort = +value[0].replace('udp1', '').replace('Game', '');
                }
                else if (value[0].toLowerCase().startsWith('query')) {
                    details.clientPort = +value[0].replace('tcp1', '').replace('Query', '');
                }
                else if (value[0].toLowerCase().startsWith('source')) {
                    details.sourceTvPort = +value[0].replace('udp1', '').replace('SourceTV', '');
                }
            });
            TwoCellArray.forEach(value => {
                switch (value[0].toLowerCase()) {
                    case ('Date').toLowerCase():
                        details.Date = value[1];
                        break;
                    case ('Distro').toLowerCase():
                        details.Distro = value[1];
                        break;
                    case ('Arch').toLowerCase():
                        details.Arch = value[1];
                        break;
                    case ('Kernel').toLowerCase():
                        details.Kernel = value[1];
                        break;
                    case ('Hostname').toLowerCase():
                        details.Hostname = value[1];
                        break;
                    case ('Uptime').toLowerCase():
                        details.Uptime = value[1];
                        break;
                    case ('Model').toLowerCase():
                        details.Model = value[1];
                        break;
                    case ('Cores').toLowerCase():
                        details.Cores = +value[1];
                        break;
                    case ('Frequency').toLowerCase():
                        details.Frequency = value[1];
                        break;
                    case ('AvgLoad').toLowerCase():
                        details.AvgLoad = value[1];
                        break;
                    case ('Mem').toLowerCase():
                        details.Mem = value[1];
                        break;
                    case ('Physical').toLowerCase():
                        details.Physical = value[1];
                        break;
                    case ('Swap').toLowerCase():
                        details.Swap = value[1];
                        break;
                    case ('Filesystem').toLowerCase():
                        details.Filesystem = value[1];
                        break;
                    case ('TotalDisk').toLowerCase():
                        details.TotalDisk = value[1];
                        break;
                    case ('Used').toLowerCase():
                        details.Used = value[1];
                        break;
                    case ('Available').toLowerCase():
                        details.Available = value[1];
                        break;
                    case ('IP').toLowerCase():
                        details.IP = value[1];
                        break;
                    case ('InternetIP').toLowerCase():
                        details.InternetIP = value[1];
                        break;
                    case ('CPUUsed').toLowerCase():
                        details.CPUUsed = value[1];
                        break;
                    case ('MemUsed').toLowerCase():
                        details.MemUsed = value[1];
                        break;
                    case ('TotalMemory').toLowerCase():
                        details.TotalMemory = value[1];
                        break;
                    case ('Servername').toLowerCase():
                        details.Servername = value[1];
                        break;
                    case ('ServerIP').toLowerCase():
                        details.ServerIP = value[1];
                        break;
                    case ('Serverpassword').toLowerCase():
                        details.Serverpassword = value[1];
                        break;
                    case ('RCONpassword').toLowerCase():
                        details.RCONpassword = value[1];
                        break;
                    case ('Maxplayers').toLowerCase():
                        details.Maxplayers = +value[1];
                        break;
                    case ('Defaultmap').toLowerCase():
                        details.Defaultmap = value[1];
                        break;
                    case ('Gametype').toLowerCase():
                        details.Gametype = +value[1];
                        break;
                    case ('Gamemode').toLowerCase():
                        details.Gamemode = +value[1];
                        break;
                    case ('Tickrate').toLowerCase():
                        details.Tickrate = +value[1];
                        break;
                    case ('Masterserver').toLowerCase():
                        details.Masterserver = value[1] == 'listed';
                        break;
                    case ('Status').toLowerCase():
                        details.Status = value[1].toLowerCase() == 'started' && details.Masterserver;
                        break;
                    case ('Scriptname').toLowerCase():
                        details.Scriptname = value[1];
                        break;
                    case ('LinuxGSMversion').toLowerCase():
                        details.LinuxGSMversion = value[1];
                        break;
                    case ('Updateonstart').toLowerCase():
                        details.Updateonstart = value[1].toLowerCase() == 'on';
                        break;
                    case ('User').toLowerCase():
                        details.User = value[1];
                        break;
                    case ('Location').toLowerCase():
                        details.Location = value[1];
                        break;
                    case ('Configfile').toLowerCase():
                        details.Configfile = value[1];
                        break;
                }
            });
            return details;
        }
        catch (e) {
            this._log.error('Während der Konvertierung der GameServer-Details ist ein Fehler aufgetreten!');
            return null;
        }
    }
    actionPerformState(rawOutput) {
        try {
            const withoutColors = rawOutput.replace(/[\u001b\u009b][[()#;?]*(?:[0-9]{1,4}(?:;[0-9]{0,4})*)?[0-9A-ORZcf-nqry=><]/g, '');
            const rows = withoutColors.split('\r');
            const lastRow = rows[rows.length - 1].replace(/\s+/g, '');
            let state = lastRow.split(']')[0];
            state = state.replace('[', '');
            return state.toLowerCase() == 'ok';
        }
        catch (e) {
            this._log.error('Während der Konvertierung des Status einer Server-Aktion ist ein Fehler aufgetreten!');
            return null;
        }
    }
}
exports.OutputParser = OutputParser;
class GameServerDetails {
    constructor(Date, Distro, Arch, Kernel, Hostname, Uptime, Model, Cores, Frequency, AvgLoad, Mem, Physical, Swap, Filesystem, TotalDisk, Used, Available, IP, InternetIP, CPUUsed, MemUsed, TotalMemory, Servername, ServerIP, Serverpassword, RCONpassword, Maxplayers, Defaultmap, Gametype, Gamemode, Tickrate, Masterserver, Status, Scriptname, LinuxGSMversion, Updateonstart, User, Location, Configfile, gamePort, clientPort, sourceTvPort) {
        this.Date = Date;
        this.Distro = Distro;
        this.Arch = Arch;
        this.Kernel = Kernel;
        this.Hostname = Hostname;
        this.Uptime = Uptime;
        this.Model = Model;
        this.Cores = Cores;
        this.Frequency = Frequency;
        this.AvgLoad = AvgLoad;
        this.Mem = Mem;
        this.Physical = Physical;
        this.Swap = Swap;
        this.Filesystem = Filesystem;
        this.TotalDisk = TotalDisk;
        this.Used = Used;
        this.Available = Available;
        this.IP = IP;
        this.InternetIP = InternetIP;
        this.CPUUsed = CPUUsed;
        this.MemUsed = MemUsed;
        this.TotalMemory = TotalMemory;
        this.Servername = Servername;
        this.ServerIP = ServerIP;
        this.Serverpassword = Serverpassword;
        this.RCONpassword = RCONpassword;
        this.Maxplayers = Maxplayers;
        this.Defaultmap = Defaultmap;
        this.Gametype = Gametype;
        this.Gamemode = Gamemode;
        this.Tickrate = Tickrate;
        this.Masterserver = Masterserver;
        this.Status = Status;
        this.Scriptname = Scriptname;
        this.LinuxGSMversion = LinuxGSMversion;
        this.Updateonstart = Updateonstart;
        this.User = User;
        this.Location = Location;
        this.Configfile = Configfile;
        this.gamePort = gamePort;
        this.clientPort = clientPort;
        this.sourceTvPort = sourceTvPort;
        //
    }
}
exports.GameServerDetails = GameServerDetails;
//# sourceMappingURL=OutputParser.js.map