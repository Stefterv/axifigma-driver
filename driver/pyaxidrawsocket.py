import asyncio
import websockets
import pyaxidraw
import json

ad = pyaxidraw.axidraw.AxiDraw()
async def handler(websocket):
    while True:
        try:
            message = await websocket.recv()

            for line in message.splitlines(True):
                res = eval(line, {}, {"ad": ad})
                await websocket.send(json.dumps(res))

        except websockets.ConnectionClosedOK:
            break
        except json.JSONDecodeError:
            print("Error decoding JSON")
        except AssertionError:
            print("Improper data")
        except SyntaxError as inst:
            await websocket.send(
                json.dumps(
                    {
                        "msg": inst.msg,
                        "lineno": inst.lineno,
                        "offset": inst.offset,
                        "text": inst.text,
                    }
                )
            )


async def main():
    async with websockets.serve(handler, "", 8001):
        await asyncio.Future()


if __name__ == "__main__":
    asyncio.run(main())
