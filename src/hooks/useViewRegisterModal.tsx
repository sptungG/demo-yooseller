import { useGetEcofarmRegisterByIdQuery } from "@/redux/query/farm.query";
import { formatNumber } from "@/utils/utils";
import { formatDate } from "@/utils/utils-date";
import { Button, Card, Col, Image, Modal, Row } from "antd";
import useChangeLocale from "./useChangeLocale";

export type TViewRegisterProps = {
  show: boolean;
  id: any;
  onClose?: () => void;
  title: string;
};

const ViewRegisterModal = ({ show, onClose, id, title }: TViewRegisterProps) => {
  const { i18n } = useChangeLocale();
  const { data: dataRes } = useGetEcofarmRegisterByIdQuery(
    { id: id },
    { refetchOnMountOrArgChange: true },
  );
  const item = dataRes?.data;
  const ecofarmPackage = item && item.properties ? JSON.parse(item.properties) : null;

  return (
    <Modal
      title={title}
      open={show}
      onCancel={() => onClose?.()}
      footer={() => (
        <>
          <Button onClick={() => onClose?.()}>Đóng</Button>
        </>
      )}
    >
      {item && (
        <div className="view-register">
          <Card size="small" style={{ marginBottom: 15 }}>
            <Row className="row_view">
              <Col span={12}>{i18n["Người đăng ký"]}</Col>
              <Col className="row_value" span={12}>
                {(item.userInfo.surName ? item.userInfo.surName + " " : "") + item.userInfo.name}
              </Col>
            </Row>
            {/* <Row className="row_view">
            <Col span={12}>Số điện thoại:</Col>
            <Col className="row_value" span={12}>
              09739439343
            </Col>
          </Row> */}
            <Row className="row_view">
              <Col span={12}>{i18n["Email"]}</Col>
              <Col className="row_value" span={12}>
                {item.userInfo.emailAddress}
              </Col>
            </Row>
          </Card>
          <Card size="small" style={{ marginBottom: 15 }}>
            <Row className="row_view">
              <Col span={12}>{i18n["Gói đầu tư"]}</Col>
              <Col className="row_value" span={12}>
                {ecofarmPackage.EcofarmPackage.Name}
              </Col>
            </Row>
            <Row className="row_view">
              <Col className="" span={24}>
                {ecofarmPackage.EcofarmPackage.ImageUrlList.length > 0 ? (
                  <Image.PreviewGroup
                    preview={{
                      onChange: (current, prev) =>
                        console.log(`current index: ${current}, prev index: ${prev}`),
                    }}
                  >
                    {ecofarmPackage.EcofarmPackage.ImageUrlList.map(
                      (itemImg: any, index: number) => (
                        // eslint-disable-next-line jsx-a11y/alt-text
                        <Image
                          key={index}
                          width={150}
                          height={120}
                          src={itemImg}
                          alt={""}
                          preview
                        />
                      ),
                    )}
                  </Image.PreviewGroup>
                ) : (
                  ""
                )}
              </Col>
            </Row>
          </Card>
          <Card size="small" style={{ marginBottom: 15 }}>
            <Row className="row_view">
              <Col span={12}>{i18n["Chủ Farm"]}</Col>
              <Col className="row_value" span={12}>
                {(item.partnerInfo.surName ? item.partnerInfo.surName + " " : "") +
                  item.partnerInfo.name}
              </Col>
            </Row>
            <Row className="row_view">
              <Col span={12}>{i18n["Email"]}</Col>
              <Col className="row_value" span={12}>
                {item.partnerInfo.emailAddress}
              </Col>
            </Row>
          </Card>
          <Card size="small" style={{ marginBottom: 15 }}>
            <Row className="row_view">
              <Col span={12}>{i18n["Số lượng đăng ký"]}</Col>
              <Col className="row_value" span={12}>
                {item.ecofarmType == 1 ? (
                  i18n["Combo gói"]
                ) : (
                  <>
                    <b>{item.numberOfShared}</b> {i18n["suất"]}
                  </>
                )}
              </Col>
            </Row>
            <Row className="row_view">
              <Col span={12}>{i18n["Tổng tiền"]}</Col>
              <Col className="row_value" span={12}>
                {formatNumber(item.totalPrice)}₫
              </Col>
            </Row>
            <Row className="row_view">
              <Col span={12}>{i18n["Ngày đăng ký"]}</Col>
              <Col className="row_value" span={12}>
                {formatDate(item.creationTime, "DD-MM-YYYY HH:mm")}
              </Col>
            </Row>
            <Row className="row_view">
              <Col span={12}>{i18n["Lời nhắn"]}</Col>
              <Col className="row_value" span={12}>
                {item.note}
              </Col>
            </Row>
          </Card>
        </div>
      )}
    </Modal>
  );
};
export default ViewRegisterModal;
