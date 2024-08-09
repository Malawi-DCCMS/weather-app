import json
import io
import sys
import typing
import urllib
import urllib.request
import zipfile

base_url = 'https://download.geonames.org/export/dump/'


def main():
    r = GeoNamesReader('MW')
    places = r.get_places()
    json.dump(places, sys.stdout, indent=2)


class GeoNamesReader:
    def __init__(self, country_code: str):
        self._country_code = country_code
        self._admin1_codes = get_simple_dataset(
            'admin1CodesASCII.txt', country_code)
        self._admin2_codes = get_simple_dataset(
            'admin2Codes.txt', country_code)
        self._feature_codes = get_simple_dataset('featureCodes_en.txt')

    def get_places(self):
        ret = []

        with urllib.request.urlopen(f'{base_url}{self._country_code}.zip') as response:
            with zipfile.ZipFile(io.BytesIO(response.read())) as z:
                with z.open('MW.txt') as f:
                    for line in f:
                        ret.append(self.get_place(line.decode("utf-8")))
        return ret

    def get_place(self, data: str) -> typing.Dict:
        elements = data.split('\t')
        name = elements[1]
        latitude = float(elements[4])
        longitude = float(elements[5])
        feature_class = elements[6]
        feature_code = elements[7]
        country_code = elements[8]
        admin_1_code = elements[10]
        admin_2_code = elements[11]
        elevation = None
        if elements[15]:
            elevation = int(elements[15])

        try:
            admin1 = self._admin1_codes[f'{country_code}.{admin_1_code}']
        except KeyError:
            admin1 = None

        try:
            admin2 = self._admin2_codes[f'{country_code}.{
                admin_1_code}.{admin_2_code}']
        except KeyError:
            admin2 = None

        try:
            feature = self._feature_codes[f'{feature_class}.{feature_code}']
        except KeyError:
            feature = None

        return {
            'name': name,
            'latitude': latitude,
            'longitude': longitude,
            'elevation': elevation,
            'admin1': admin1,
            'admin2': admin2,
            'feature': feature

        }


def get_simple_dataset(name: str, country_code: typing.Optional[str] = None) -> typing.Dict[str, str]:
    ret = {}
    with urllib.request.urlopen(base_url + name) as response:
        for r in response:
            r = r.decode("utf-8")
            if country_code:
                if not r.startswith(country_code+'.'):
                    continue
            elements = r.split('\t')
            ret[elements[0]] = elements[1]
    return ret


if __name__ == '__main__':
    main()
