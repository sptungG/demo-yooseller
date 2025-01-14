import styled from "@emotion/styled";
import { useSafeState } from "ahooks";
import { Badge, Divider, Popover, Typography } from "antd";
import { useId } from "react";
import { MdSchool, MdVisibility, MdWork, MdWorkspacePremium } from "react-icons/md";
import { formatDate } from "src/utils/utils-date";
import Avatar from "../avatar/Avatar";

type TMedItemStyledProps = any;

const MedItemStyled = (item: TMedItemStyledProps) => {
  const [open, setOpen] = useSafeState(false);
  const uid = useId();
  return (
    <MedItemStyledStyled>
      <div className="left-wrapper">
        <Popover
          overlayInnerStyle={{ padding: 0 }}
          content={
            <PopoverContentStyled className="custom-scrollbar">
              <div className="infor-wrapper">
                <Typography.Text type="secondary" ellipsis>
                  Ngày sinh: {formatDate(item.personalInfor.dateOfBirth, "DD-MM-YYYY")}
                </Typography.Text>
                <Typography.Text type="secondary" ellipsis>
                  SĐT: {item.personalInfor.phoneNumber}
                </Typography.Text>
                <Typography.Text type="secondary" ellipsis>
                  Email: {item.personalInfor.email}
                </Typography.Text>
                <Typography.Text type="secondary" ellipsis>
                  Địa chỉ: {item.personalInfor.address}
                </Typography.Text>
              </div>
              <Divider
                style={{ margin: "12px 0 0" }}
                plain
                orientation="left"
                orientationMargin={-2}
              >
                <Typography.Text type="secondary">
                  <MdSchool /> Học vấn
                </Typography.Text>
              </Divider>
              <div className="literacy timeline-list">
                {(item.literacy as any[]).map((item, index) => (
                  <div className="timeline-item" key={uid + "literacy" + index}>
                    <div className="left-wrapper">
                      <Typography.Text type="secondary">
                        {formatDate(item.dateFrom, "MM-YYYY")}
                      </Typography.Text>
                      <Typography.Text type="secondary">
                        {formatDate(item.dateTo, "MM-YYYY")}
                      </Typography.Text>
                    </div>
                    <div className="right-wrapper">
                      <Typography.Text type="secondary" strong ellipsis>
                        {item.university}
                      </Typography.Text>
                      <Typography.Text type="secondary" ellipsis>
                        {item.major}
                      </Typography.Text>
                    </div>
                  </div>
                ))}
              </div>
              <Divider
                style={{ margin: "12px 0 0" }}
                plain
                orientation="left"
                orientationMargin={-2}
              >
                <Typography.Text type="secondary">
                  <MdWork /> Kinh nghiệm
                </Typography.Text>
              </Divider>
              <div className="experience timeline-list">
                {(item.experience as any[]).map((item, index) => (
                  <div className="timeline-item" key={uid + "experience" + index}>
                    <div className="left-wrapper">
                      <Typography.Text type="secondary">
                        {formatDate(item.dateFrom, "MM-YYYY")}
                      </Typography.Text>
                      <Typography.Text type="secondary">
                        {formatDate(item.dateTo, "MM-YYYY")}
                      </Typography.Text>
                    </div>
                    <div className="right-wrapper">
                      <Typography.Text type="secondary" strong ellipsis>
                        {item.position}
                      </Typography.Text>
                      <Typography.Text type="secondary" ellipsis>
                        {item.company}
                      </Typography.Text>
                    </div>
                  </div>
                ))}
              </div>
              <Divider
                style={{ margin: "12px 0 0" }}
                plain
                orientation="left"
                orientationMargin={-2}
              >
                <Typography.Text type="secondary">
                  <MdWorkspacePremium /> Chứng chỉ
                </Typography.Text>
              </Divider>
              <div className="certificate timeline-list">
                {(item.certificate as any[]).map((item, index) => (
                  <div className="timeline-item" key={uid + "certificate" + index}>
                    <div className="left-wrapper">
                      <Typography.Text type="secondary">
                        {formatDate(item.dateFrom, "MM-YYYY")}
                      </Typography.Text>
                      <Typography.Text type="secondary">
                        {formatDate(item.dateTo, "MM-YYYY")}
                      </Typography.Text>
                    </div>
                    <div className="right-wrapper">
                      <Typography.Text type="secondary" strong ellipsis>
                        {item.name}
                      </Typography.Text>
                      <Typography.Text type="secondary" ellipsis>
                        {item.description}
                      </Typography.Text>
                    </div>
                  </div>
                ))}
              </div>
            </PopoverContentStyled>
          }
          title={<div style={{ padding: "8px 12px 0" }}>{item.personalInfor.name}</div>}
          trigger="click"
          open={open}
          onOpenChange={setOpen}
          arrow={false}
          placement="topLeft"
        >
          <div className="name-wrapper">
            <Typography.Text type="secondary" strong ellipsis style={{ maxWidth: 160 }}>
              {item.personalInfor.name}
            </Typography.Text>
            <MdVisibility className="view-icon" size={16} />
          </div>
        </Popover>
        <Typography.Text type="secondary" ellipsis>
          {item.personalInfor.phoneNumber}
        </Typography.Text>
      </div>
      <div className="right-wrapper">
        <Badge count={item.literacy.length || 0} overflowCount={9}>
          <Avatar icon={<MdSchool size={20} />} />
        </Badge>
        <Badge count={item.experience.length || 0} overflowCount={9}>
          <Avatar icon={<MdWork size={20} />} />
        </Badge>
        <Badge count={item.certificate.length || 0} overflowCount={9}>
          <Avatar icon={<MdWorkspacePremium size={20} />} />
        </Badge>
      </div>
    </MedItemStyledStyled>
  );
};
const PopoverContentStyled = styled.div`
  padding: 0 12px 6px;
  max-height: 334px;
  overflow-y: auto;
  .infor-wrapper {
    display: flex;
    flex-direction: column;
  }
  .timeline-item {
    display: flex;
    margin-bottom: 6px;
    .left-wrapper {
      display: flex;
      flex-direction: column;
      flex: 0 0 auto;
      min-width: 0px;
      margin-right: 8px;
    }
    .right-wrapper {
      display: flex;
      flex-direction: column;
      flex: 1 1 auto;
      min-width: 0px;
      max-width: 240px;
    }
  }
`;
const MedItemStyledStyled = styled.div`
  display: flex;
  flex-wrap: nowrap;
  border-left: 4px solid ${({ theme }) => theme.generatedColors[3]};
  padding-left: 6px;
  .left-wrapper {
    display: flex;
    flex-direction: column;
    flex: 1 1 auto;
    min-width: 0px;
    padding-right: 12px;
    align-self: flex-start;
    .name-wrapper {
      cursor: pointer;
      .view-icon {
        color: rgba(0, 0, 0, 0.45);
      }
    }
  }
  .right-wrapper {
    flex: 0 0 auto;
    min-width: 0px;
    margin-left: auto;
    display: flex;
    flex-wrap: nowrap;
    align-self: center;
    gap: 12px;
    .ant-avatar {
      display: flex;
      justify-content: center;
      align-items: center;
    }
    .ant-badge .ant-badge-count {
      background-color: transparent;
      color: ${({ theme }) => theme.colorPrimary};
      box-shadow: none;
      font-size: 14px;
    }
  }
`;

export default MedItemStyled;
