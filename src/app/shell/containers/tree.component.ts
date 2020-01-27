import { Component, OnDestroy, OnInit } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { isNotNil, urlMatches } from '@web/util';
import { NzFormatEmitEvent, NzTreeNodeOptions } from 'ng-zorro-antd';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { Tree } from '../services/tree.service';

@Component({
  selector: 'app-tree',
  template: `
    <nz-tree
      [nzData]="nodes"
      [nzTreeTemplate]="nzTreeTemplate"
      [nzExpandedKeys]="expandedNodeKeys"
      [nzSelectedKeys]="selectedNodeKeys"
      [nzExpandedIcon]="expandedIconTpl"
      (nzClick)="onNodeClick($event)"
      (nzExpandChange)="onNodeExpandChange($event)"
    >
      <ng-template #expandedIconTpl let-node>
        <i
          nz-icon
          nzType="down"
          nzTheme="outline"
          class="ant-tree-switcher-icon"
          [class.active]="node.isSelected"
        ></i>
      </ng-template>
      <ng-template #nzTreeTemplate let-node>
        <span class="tree-node" [class.active]="node.isSelected">
          <span class="tree-name">{{ node.title }}</span>
        </span>
      </ng-template>
    </nz-tree>
  `,
  styleUrls: ['./tree.component.less']
})
export class TreeComponent implements OnInit, OnDestroy {
  nodes: NzTreeNodeOptions[] = [];
  expandedNodeKeys: string[] = ['root'];
  selectedNodeKeys: string[] = [];

  destroy$ = new Subject();

  constructor(private router: Router, private tree: Tree) {}

  ngOnInit() {
    // Load tree nodes
    this.tree.loaded$
      .pipe(takeUntil(this.destroy$))
      .subscribe(nodes => this.onNodesLoad(nodes));
    this.router.events.pipe(takeUntil(this.destroy$)).subscribe(event => {
      if (event instanceof NavigationEnd && isNotNil(this.nodes)) {
        this.selectActiveNode(this.nodes);
      }
    });
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  onNodesLoad(nodes: NzTreeNodeOptions[]) {
    this.nodes = nodes;
    this.selectActiveNode(nodes);
  }

  private selectActiveNode(nodes: NzTreeNodeOptions[]) {
    const stack: NzTreeNodeOptions[] = [];
    const expandedNodeKeys: string[] = Object.assign([], this.expandedNodeKeys);
    let selectedNodeKeys: string[] = [];
    let lastItem: NzTreeNodeOptions = null;
    stack.push(...nodes);

    while (stack.length > 0) {
      const item = stack.pop();
      if (urlMatches(item.url)) {
        if (item.children) {
          expandedNodeKeys.push(item.key);
        }
        selectedNodeKeys = [item.key];
        lastItem = item;
      }

      if (item.children) {
        stack.push(...item.children);
      }
    }

    this.selectedNodeKeys = selectedNodeKeys;
    this.expandedNodeKeys = expandedNodeKeys;

    this.tree.select(lastItem);
  }

  onNodeExpandChange($event: NzFormatEmitEvent) {
    const item = $event.node;
    const isInKeys = this.expandedNodeKeys.find(p => p === item.key);
    if (isInKeys) {
      this.expandedNodeKeys = this.expandedNodeKeys.filter(p => p !== item.key);
    } else {
      this.expandedNodeKeys = [...this.expandedNodeKeys, item.key];
    }
  }

  onNodeClick($event: NzFormatEmitEvent) {
    const item = $event.node.origin;
    if (isNotNil(item.url)) {
      this.router.navigateByUrl(item.url);
    }

    this.selectedNodeKeys = [item.key];
    this.onNodeExpandChange($event);
  }
}
