import { Injectable } from '@nestjs/common'

@Injectable()
export class AppService {
  async getHello() {
    // const res = await fetch(
    //   'https://opensky-network.org/api/states/all?time=1716289061',
    // );
    // return res;
    // .then((res) => {
    //   return res;
    // })
    // .catch((err) => {
    //   console.error(err);
    // });
    const username = 'plong12112002'
    const password = 'Long12112002'

    // Authorization: 'Basic ' + btoa(username + ':' + password),
    const res = await fetch(
      // 'https://opensky-network.org/api/states/all?extended=1&lamin=-85.05112900000009&lomin=-203.04088594010116&lamax=85.05112877980659&lomax=181.73644745141752',
      // 'https://opensky-network.org/api/flights/all?begin=1517184000&end=1517270400',
      // 'https://opensky-network.org/api/states/all',
      'https://api.adsb.lol/v2/ladd',
      // 'https://opensky-network.org/api/states/all?begin=1517184000&end=1517270400',
      // 'https://opensky-network.org/api/flights/aircraft?icao24=e88088&begin=1517184000&end=1517270400',
      {
        headers: {
          Authorization: `Basic ${Buffer.from(`${username}:${password}`).toString('base64')}`
        }
      }
    )
    // .then((response) => response.json())
    // .then((data) => console.log(data))
    // .catch((error) => console.error('Error:', error));

    // return res.json();
    return process.env.MONGO_URI
  }
}
