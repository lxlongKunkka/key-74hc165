// Add your code here

let SR_CLK = DigitalPin.P20;
let INSR0_DATA = DigitalPin.P14;        //data
let INSR_LATCH = DigitalPin.P9;         //PL

enum KEY
{
    UP = 0,
    DOWN,
    LEFT,
    RIGHT,
    A,
    B,
    MENU
}

//% weight=20 color=#3333ff icon="\uf11b"
namespace SimpleShieldKey
{
    function Read74HC165(): number
    {
        let val = 0;
        pins.digitalWritePin(INSR_LATCH, 0);    //scan
        control.waitMicros(10);
        pins.digitalWritePin(INSR_LATCH, 1);
        let i = 0;
        for(i=0; i<8; i++)
        {
            val = val << 1;
            pins.digitalWritePin(SR_CLK, 0);
            control.waitMicros(10);
            let tmp = pins.digitalReadPin(INSR0_DATA);
            val |= tmp;
            pins.digitalWritePin(SR_CLK, 1);
        }
        return val;
    }

    //% blockID==Listen_Key
    //% block="Key %pin |Press"
    //% weight=90
    export function Listen_Key(pin: KEY): boolean
    {
        let val = Read74HC165();
        let res = 2;
        switch(pin)
        {
            case KEY.UP:
                res = (val >> 1) & 0x01;
                break;
            case KEY.DOWN:
                res = (val >> 2) & 0x01;
                break;
            case KEY.LEFT:
                res = (val >> 0) & 0x01;
                break;
            case KEY.RIGHT:
                res = (val >> 3) & 0x01;
                break;
            case KEY.A:
                res = (val >> 4) & 0x01;
                break;
            case KEY.B:
                res = (val >> 5) & 0x01;
                break;
            case KEY.MENU:
                res = (val >> 6) & 0x01;
                break;
            default:
                break;
        }
        return !res;
    }
}

