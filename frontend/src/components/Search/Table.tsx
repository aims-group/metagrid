import {
  DownCircleOutlined,
  DownloadOutlined,
  MinusOutlined,
  PlusOutlined,
  RightCircleOutlined,
} from '@ant-design/icons';
import { Form, message, Select, Table as TableD } from 'antd';
import { SizeType } from 'antd/lib/config-provider/SizeContext';
import { TablePaginationConfig } from 'antd/lib/table';
import React from 'react';
import { fetchWgetScript, openDownloadURL, ResponseError } from '../../api';
import qualityFlagsImg from '../../assets/img/climate_indicators_table.png';
import { CSSinJS } from '../../common/types';
import {
  formatBytes,
  objectHasKey,
  splitStringByChar,
} from '../../common/utils';
import { UserCart } from '../Cart/types';
import Popover from '../DataDisplay/Popover';
import ToolTip from '../DataDisplay/ToolTip';
import Button from '../General/Button';
import StatusToolTip from '../NodeStatus/StatusToolTip';
import { NodeStatusArray } from '../NodeStatus/types';
import './Search.css';
import Tabs from './Tabs';
import { RawSearchResult, RawSearchResults, TextInputs } from './types';

const styles: CSSinJS = {
  qualityFlagsRow: { display: 'flex' },
  flagColorBox: {
    width: '16px',
    height: '16px',
    backgroundColor: '#ccc',
    border: '1px',
    borderStyle: 'solid',
    borderColor: '#666',
    margin: '2px',
  },
};

export type QualityFlagProps = { index: string; color: string };

export const QualityFlag: React.FC<QualityFlagProps> = ({ index, color }) => (
  <div
    data-testid={`qualityFlag${index}`}
    style={{ ...styles.flagColorBox, backgroundColor: color }}
  ></div>
);

export type Props = {
  loading: boolean;
  canDisableRows?: boolean;
  results: RawSearchResults | [];
  totalResults?: number;
  userCart: UserCart | [];
  nodeStatus?: NodeStatusArray;
  filenameVars?: TextInputs | [];
  onUpdateCart: (item: RawSearchResults, operation: 'add' | 'remove') => void;
  onRowSelect?: (selectedRows: RawSearchResults | []) => void;
  onPageChange?: (page: number, pageSize: number) => void;
  onPageSizeChange?: (size: number) => void;
};

const Table: React.FC<Props> = ({
  loading,
  canDisableRows = true,
  results,
  totalResults,
  userCart,
  nodeStatus,
  filenameVars,
  onUpdateCart,
  onRowSelect,
  onPageChange,
  onPageSizeChange,
}) => {
  // Add options to this constant as needed
  type DatasetDownloadTypes = 'wget' | 'Globus';
  // If a record supports downloads from the allowed downloads, it will render
  // in the drop downs
  const allowedDownloadTypes: DatasetDownloadTypes[] = ['wget'];

  const tableConfig = {
    size: 'small' as SizeType,
    loading,
    pagination: {
      total: totalResults,
      position: ['bottomCenter'],
      showSizeChanger: true,
      onChange: (page: number, pageSize: number) =>
        onPageChange && onPageChange(page, pageSize),
      onShowSizeChange: (_current: number, size: number) =>
        onPageSizeChange && onPageSizeChange(size),
    } as TablePaginationConfig,
    expandable: {
      expandedRowRender: (record: RawSearchResult) => (
        <Tabs record={record} filenameVars={filenameVars}></Tabs>
      ),
      expandIcon: ({
        expanded,
        onExpand,
        record,
      }: {
        expanded: boolean;
        onExpand: (
          rowRecord: RawSearchResult,
          e: React.MouseEvent<HTMLSpanElement, MouseEvent>
        ) => void;
        record: RawSearchResult;
      }): React.ReactElement =>
        expanded ? (
          <DownCircleOutlined onClick={(e) => onExpand(record, e)} />
        ) : (
          <ToolTip
            title="View this dataset's metadata, files, and citation"
            trigger="hover"
          >
            <RightCircleOutlined onClick={(e) => onExpand(record, e)} />
          </ToolTip>
        ),
    },
    rowSelection: {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      onSelect: (_record: any, _selected: any, selectedRows: any) => {
        /* istanbul ignore else */
        if (onRowSelect) {
          onRowSelect(selectedRows);
        }
      },
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      onSelectAll: (_selected: any, selectedRows: any) => {
        /* istanbul ignore else */
        if (onRowSelect) {
          onRowSelect(selectedRows);
        }
      },
      getCheckboxProps: (record: RawSearchResult) => ({
        disabled:
          canDisableRows && userCart.some((item) => item.id === record.id),
      }),
    },

    hasData: results.length > 0,
  };

  const columns = [
    {
      title: 'Dataset Title',
      dataIndex: 'title',
      key: 'title',
      width: 400,
    },
    {
      title: '# of Files',
      dataIndex: 'number_of_files',
      key: 'number_of_files',
      width: 100,
      render: (numberOfFiles: number) => <p>{numberOfFiles || 'N/A'}</p>,
    },
    {
      title: 'Total Size',
      dataIndex: 'size',
      key: 'size',
      width: 100,
      render: (size: number) => <p>{size ? formatBytes(size) : 'N/A'}</p>,
    },
    {
      title: 'Node',
      dataIndex: 'data_node',
      width: 225,
      render: (data_node: string) => (
        <StatusToolTip nodeStatus={nodeStatus} dataNode={data_node} />
      ),
    },
    {
      title: 'Version',
      dataIndex: 'version',
      key: 'version',
      width: 100,
    },
    {
      title: 'Download',
      key: 'download',
      width: 200,
      render: (record: RawSearchResult) => {
        const supportedDownloadTypes = record.access;
        const formKey = `download-${record.id}`;

        /**
         * Handle the download form for datasets
         */
        const handleDownloadForm = (
          downloadType: DatasetDownloadTypes
        ): void => {
          /* istanbul ignore else */
          if (downloadType === 'wget') {
            // eslint-disable-next-line no-void
            void message.success(
              'The wget script is generating, please wait momentarily.'
            );
            fetchWgetScript(record.id, filenameVars)
              .then((url) => {
                openDownloadURL(url);
              })
              .catch((error: ResponseError) => {
                // eslint-disable-next-line no-void
                void message.error(error.message);
              });
          }
        };

        return (
          <>
            <Form
              layout="inline"
              onFinish={({ [formKey]: download }) =>
                handleDownloadForm(download)
              }
              initialValues={{ [formKey]: allowedDownloadTypes[0] }}
            >
              <Form.Item name={formKey}>
                <Select style={{ width: 120 }}>
                  {allowedDownloadTypes.map(
                    (option) =>
                      (supportedDownloadTypes.includes(option) ||
                        option === 'wget') && (
                        <Select.Option
                          key={`${formKey}-${option}`}
                          value={option}
                        >
                          {option}
                        </Select.Option>
                      )
                  )}
                </Select>
              </Form.Item>
              <Form.Item>
                <Button
                  type="default"
                  htmlType="submit"
                  icon={<DownloadOutlined />}
                ></Button>
              </Form.Item>
            </Form>
          </>
        );
      },
    },
    {
      title: 'Additional',
      key: 'additional',
      width: 200,
      render: (record: RawSearchResult) => {
        // Have to parse and format since 'xlink' attribute is poorly structured
        // in the Search API
        const xlinkTypesToOutput: Record<
          string,
          { label: string; url: null | string }
        > = {
          pid: { label: 'PID', url: null },
          // Some technical notes are published as "summary"
          summary: { label: 'Technical Notes', url: null },
          supdata: { label: 'Supplemental Data', url: null },
          'Tech Note': { label: 'Technical Notes', url: null },
        };
        /* istanbul ignore else */
        if (objectHasKey(record, 'xlink')) {
          const { xlink } = record;

          (xlink as string[]).forEach((link) => {
            const [url, , linkType] = splitStringByChar(link, '|') as string[];

            if (Object.keys(xlinkTypesToOutput).includes(linkType)) {
              xlinkTypesToOutput[linkType].url = url;
            }
          });
        }

        // Have to parse and format since 'quality_control_flags' attribute is
        // poorly structured in the Search API
        const qualityFlags: Record<string, string> = {};
        /* istanbul ignore else */
        if (objectHasKey(record, 'quality_control_flags')) {
          const { quality_control_flags: qcFlags } = record;

          (qcFlags as string[]).forEach((flag) => {
            const [, key, color] = splitStringByChar(flag, ':') as string[];
            // Sometimes colors are snakecase, such as 'light_gray'
            qualityFlags[key] = color.replace('_', '');
          });
        }

        return (
          <>
            {Object.keys(xlinkTypesToOutput).map((linkType) => {
              const { label, url } = xlinkTypesToOutput[linkType];

              if (url) {
                return (
                  <Button type="link" href={url} target="_blank" key={label}>
                    <span>{label}</span>
                  </Button>
                );
              }
              return null;
            })}

            {/* Records may return "further_info_url": [''], which indicates no available URLs */}
            {objectHasKey(record, 'further_info_url') &&
              ((record.further_info_url as unknown) as string)[0] !== '' && (
                <Button
                  type="link"
                  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                  href={record.further_info_url![0]}
                  target="_blank"
                >
                  ES-DOC
                </Button>
              )}

            {Object.keys(qualityFlags).length > 0 && (
              <Button
                type="link"
                href="https://esgf-node.llnl.gov/projects/obs4mips/DatasetIndicators"
                target="_blank"
              >
                <Popover
                  content={
                    <img
                      src={qualityFlagsImg}
                      alt="Quality Flags Indicator"
                    ></img>
                  }
                >
                  <span style={styles.qualityFlagsRow}>
                    {Object.keys(qualityFlags).map((key) => (
                      <QualityFlag
                        index={key}
                        color={qualityFlags[key]}
                        key={key}
                      />
                    ))}
                  </span>
                </Popover>
              </Button>
            )}
          </>
        );
      },
    },
    {
      title: 'Cart',
      key: 'cart',
      width: 50,
      render: (record: RawSearchResult) => {
        if (
          userCart.some((dataset: RawSearchResult) => dataset.id === record.id)
        ) {
          return (
            <>
              <Button
                icon={<MinusOutlined />}
                onClick={() => onUpdateCart([record], 'remove')}
                danger
              />
            </>
          );
        }
        return (
          <>
            <Button
              type="primary"
              icon={<PlusOutlined />}
              onClick={() => onUpdateCart([record], 'add')}
            />
          </>
        );
      },
    },
  ];

  return (
    <TableD
      {...tableConfig}
      columns={columns}
      dataSource={results}
      rowKey="id"
      scroll={{ y: 'calc(70vh)' }}
    />
  );
};

export default Table;
