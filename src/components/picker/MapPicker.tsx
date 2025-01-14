import styled from "@emotion/styled";
import { GoogleMap, InfoWindow, Marker, useGoogleMap, useLoadScript } from "@react-google-maps/api";
import { useSafeState } from "ahooks";
import { Divider, Form, Input, Tooltip, Typography } from "antd";
import { memo, useId } from "react";
import { BsQuestionCircleFill } from "react-icons/bs";
import { DEFAULT_POSITION, GOOGLE_MAP_API_KEY } from "src/configs/constant.config";
import useChangeLocale from "src/hooks/useChangeLocale";
import { useReverseGeocodingMutation } from "src/redux/query/nominatim.query";

type TMapPickerProps = {
  style?: React.CSSProperties;
  draggable?: boolean;
  value?: {
    lat: number;
    lng: number;
  };
  onChange?: (value?: { lat: number; lng: number }) => void;
  onChangeAddressName?: (value?: string) => void;
};

const ChangeView = ({ center }: any) => {
  const map = useGoogleMap();
  map?.panTo(center);
  return null;
};

const MapPicker = ({ draggable, value, onChange, onChangeAddressName, style }: TMapPickerProps) => {
  const uid = useId();
  const { i18n } = useChangeLocale();
  const { isLoaded } = useLoadScript({
    googleMapsApiKey: GOOGLE_MAP_API_KEY,
  });
  const [internalValue, setInternalValue] = useSafeState<string | undefined>(
    !!value ? Object.values(value).join(",") : undefined,
  );

  const [mutateReverseGeocoding, { data, isLoading }] = useReverseGeocodingMutation();
  const { status } = Form.Item.useStatus();

  return (
    <MapPickerStyled>
      <div className="input-wrapper">
        <Input
          allowClear
          value={internalValue}
          style={{ minWidth: 312, borderRadius: 2 }}
          onChange={(e) => {
            if (!!e.target.value) {
              setInternalValue(e.target.value.replace(/[^\d,.]+/g, ""));
            } else {
              setInternalValue(undefined);
              onChange?.(undefined);
            }
          }}
          onPressEnter={(e) => {
            e.preventDefault();
            try {
              if (!!internalValue) {
                const [newLat, newLng] = internalValue.split(",");
                if (!!+newLat && !!+newLng) {
                  const newGeoLocation = {
                    lat: +newLat,
                    lng: +newLng,
                  };
                  setInternalValue(`${newGeoLocation.lat},${newGeoLocation.lng}`);
                  mutateReverseGeocoding(newGeoLocation)
                    .unwrap()
                    .then((res) => {
                      onChangeAddressName?.(res?.display_name);
                    })
                    .catch(() => {});
                  onChange?.(newGeoLocation);
                } else {
                  setInternalValue(undefined);
                  onChange?.(undefined);
                }
              } else {
                setInternalValue(undefined);
                onChange?.(undefined);
              }
            } catch (error) {}
          }}
          status={status === "error" ? "error" : undefined}
          placeholder={i18n["Nhập vĩ độ,kinh độ địa chỉ hiện tại"]}
          suffix={
            <div className="previous-actions">
              <Divider type="vertical" style={{ height: 24 }} />
              <Tooltip
                overlayStyle={{ maxWidth: 400 }}
                title={
                  <div>
                    <Typography.Paragraph style={{ color: "#fff", margin: 0 }}>
                      {`Lấy vĩ độ(latitude) và kinh độ(longitude) từ đường dẫn`}
                    </Typography.Paragraph>
                    <Typography.Paragraph style={{ color: "#fff", margin: 0 }}>
                      {`GoogleMap: (...google.com/maps/.../@`}
                      <Typography.Text type="success">latitude,longitude</Typography.Text>
                      {`,...)`}
                    </Typography.Paragraph>
                    <Typography.Text style={{ color: "#fff" }}>--- hoặc ---</Typography.Text>
                    <Typography.Paragraph style={{ color: "#fff", margin: 0 }}>
                      {`Kéo thả tới vị trí cửa hàng trên bản đồ`}
                    </Typography.Paragraph>
                  </div>
                }
              >
                <BsQuestionCircleFill className="icon-ques" />
              </Tooltip>
            </div>
          }
        />
      </div>
      {isLoaded && (
        <GoogleMap
          mapContainerStyle={style}
          zoom={16}
          options={{ mapTypeControl: false, streetViewControl: false }}
        >
          <ChangeView center={value || DEFAULT_POSITION} />
          <Marker
            position={value || DEFAULT_POSITION}
            draggable={draggable}
            onDragEnd={(e) => {
              const lat = e.latLng?.lat();
              const lng = e.latLng?.lng();
              if (!!lat && !!lng) {
                const newGeoLocation = { lat, lng };
                mutateReverseGeocoding(newGeoLocation)
                  .unwrap()
                  .then((res) => {
                    onChangeAddressName?.(res?.display_name);
                  })
                  .catch(() => {});
                setInternalValue(`${newGeoLocation.lat},${newGeoLocation.lng}`);
                onChange?.(newGeoLocation);
              } else {
                setInternalValue(undefined);
                onChange?.(undefined);
              }
            }}
          >
            {!!data?.display_name ? (
              <InfoWindow
                key={uid + String(value || DEFAULT_POSITION)}
                onLoad={() => {}}
                position={value || DEFAULT_POSITION}
              >
                <div>{data.display_name}</div>
              </InfoWindow>
            ) : (
              <></>
            )}
          </Marker>
        </GoogleMap>
      )}
    </MapPickerStyled>
  );
};
const MapPickerStyled = styled.div`
  position: relative;
  .input-wrapper {
    position: relative;
  }
  .previous-actions {
    display: flex;
    align-items: center;
    z-index: 10;
    .icon-ques {
      cursor: pointer;
    }
  }
`;

export default memo(MapPicker);
